/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { GeminiAPIProvider, useGeminiAPIContext } from "./gemini/contexts/GeminiAPIContext";
import GeminiDebug from "./gemini/components/GeminiDebug";
import { Content, FunctionCall } from '@google/genai';
import {
  Ingredient,
  LabAction,
  TimelineEntry,
  CombinationResult,
  Order,
  VerificationResult,
  LAB_ACTIONS,
  STARTING_INGREDIENTS,
  PRESELECTED_INGREDIENTS,
  EXAMPLE_ORDERS,
  COMBINATION_SYSTEM_INSTRUCTION,
  COMBINATION_RESPONSE_SCHEMA,
  VERIFICATION_SYSTEM_INSTRUCTION,
  VERIFICATION_RESPONSE_SCHEMA,
  generateLabTools,
  buildSynthesisAgentSystemInstruction,
} from './constants';
import { EQUIPMENT_CATALOG, Equipment } from './src/data/equipment';
import LabScene from './src/components/LabScene';

// ============================================================================
// Ingredient Normalization Helper
// ============================================================================

/**
 * Normalizes ingredient names for case/spacing/symbol insensitive comparison.
 * Removes all non-alphanumeric characters and converts to lowercase.
 */
function normalizeIngredientName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Finds an ingredient in the inventory using normalized name comparison.
 * Returns the actual inventory item if found, null otherwise.
 */
function findIngredientInInventory(name: string, inventory: Ingredient[]): Ingredient | null {
  const normalizedSearch = normalizeIngredientName(name);
  return inventory.find(ing => normalizeIngredientName(ing.name) === normalizedSearch) || null;
}

/**
 * Resolves a model-requested ingredient name to an actual inventory item using fuzzy matching.
 */
function resolveIngredientName(name: string, inventory: Ingredient[]): Ingredient | null {
  const normalizedSearch = normalizeIngredientName(name);

  // 1. Exact normalized match
  let match = findIngredientInInventory(name, inventory);
  if (match) return match;

  // 2. Emoji match (e.g. "H" matches "Hydrogen")
  match = inventory.find(ing => normalizeIngredientName(ing.emoji) === normalizedSearch);
  if (match) return match;

  // 3. Word match (e.g. "C Carbon" matches "Carbon")
  const searchWords = name.toLowerCase().split(/[^a-z0-9]+/);
  match = inventory.find(ing => {
    const ingNameNormalized = normalizeIngredientName(ing.name);
    return searchWords.some(sw => sw === ingNameNormalized);
  });
  if (match) return match;

  // 4. Substring match (e.g. "Hydrogen oxide" matches "Hydrogen")
  match = inventory.find(ing => {
    const ingNameNormalized = normalizeIngredientName(ing.name);
    return ingNameNormalized.length > 3 && normalizedSearch.includes(ingNameNormalized);
  });

  return match || null;
}

/**
 * Checks if an ingredient already exists in the inventory using normalized comparison.
 */
function isDuplicateIngredient(name: string, inventory: Ingredient[]): boolean {
  return findIngredientInInventory(name, inventory) !== null;
}

// ============================================================================
// Equipment Catalog Component
// ============================================================================

function EquipmentCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(EQUIPMENT_CATALOG.map(e => e.category)))];

  const filteredEquipment = EQUIPMENT_CATALOG.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="lab-section equipment-catalog-section">
      <div className="section-header">
        <div className="section-header-text">
          <h2 className="section-title">Equipment Catalog</h2>
          <p className="section-subtitle">Browse 100 essential laboratory tools and instruments</p>
        </div>
        <span className="section-count">count: {EQUIPMENT_CATALOG.length}</span>
      </div>

      <div className="catalog-controls">
        <div className="search-wrapper">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search equipment..."
            className="catalog-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="catalog-category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="equipment-grid">
        {filteredEquipment.map(item => (
          <div key={item.id} className="equipment-card">
            <div className="equipment-image-container">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="equipment-image"
                referrerPolicy="no-referrer"
              />
              <div className="equipment-category-tag">{item.category}</div>
            </div>
            <div className="equipment-info">
              <h3 className="equipment-name">{item.name}</h3>
              <p className="equipment-description">{item.description}</p>
            </div>
          </div>
        ))}
        {filteredEquipment.length === 0 && (
          <div className="catalog-empty">
            No equipment found matching your search.
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Ingredient Tile Component
// ============================================================================

interface IngredientTileProps {
  ingredient: Ingredient;
  isSelected: boolean;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

function IngredientTile({ ingredient, isSelected, isActive, isDisabled, onClick }: IngredientTileProps) {
  return (
    <button
      className={`ingredient-tile ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      title={ingredient.name}
      data-ingredient={ingredient.name}
      disabled={isDisabled}
    >
      <span className="emoji">{ingredient.emoji}</span>
      <span className="name">{ingredient.name}</span>
    </button>
  );
}

// ============================================================================
// Action Tile Component
// ============================================================================

interface ActionTileProps {
  action: LabAction;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

function ActionTile({ action, isActive, isDisabled, onClick }: ActionTileProps) {
  return (
    <button
      className={`action-tile ${isActive ? 'active' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
      title={action.displayName}
      data-action={action.name}
    >
      <span className="emoji">{action.emoji}</span>
      <span className="name">{action.name}()</span>
    </button>
  );
}

// ============================================================================
// Timeline Item Component
// ============================================================================

interface TimelineItemProps {
  entry: TimelineEntry;
}

function TimelineItem({ entry }: TimelineItemProps) {
  const hasAction = entry.action && entry.ingredients;
  const hasText = entry.text;
  const isLoading = hasAction && entry.result === null;

  // Text-only entry
  if (hasText && !hasAction) {
    return (
      <div className="timeline-item timeline-text-only">
        <div className="timeline-text-content">
          {entry.text}
        </div>
      </div>
    );
  }

  // Action entry (possibly with text)
  return (
    <div className={`timeline-item ${isLoading ? 'loading' : ''}`}>
      {hasText && (
        <div className="timeline-text-content">
          {entry.text}
        </div>
      )}
      {hasAction && (
        <>
          <div className="timeline-action">
            <span className="action-name">{entry.action}(</span>
            <span className="action-args">{entry.ingredients?.join(', ')}</span>
            <span className="action-name">)</span>
          </div>
          <div className="timeline-result">
            <span className="timeline-result-arrow">↳</span>
            {isLoading ? (
              <span className="spinner">⏳</span>
            ) : (
              <>
                <span className="result-emoji">{entry.result!.emoji}</span>
                <span className="result-name">{entry.result!.name}</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Target Card Component
// ============================================================================

interface OrderCardProps {
  order: Order;
  isDisabled: boolean;
  onPickUp: (orderId: string) => void;
  onSynthesizeWithGemini: (orderName: string) => void;
  onOpenVerificationAgent?: () => void;
}

function OrderCard({ order, isDisabled, onPickUp, onSynthesizeWithGemini, onOpenVerificationAgent }: OrderCardProps) {
  const statusClass = order.status === 'completed' ? 'completed' :
    order.status === 'failed' ? 'failed' :
      order.status === 'in_progress' ? 'in-progress' : 'not-started';

  const difficultyClass = order.difficulty ? `difficulty-${order.difficulty}` : '';

  return (
    <div className={`order-card ${statusClass} ${isDisabled ? 'disabled' : ''}`}>
      {order.difficulty && (
        <div className={`order-difficulty ${difficultyClass}`}>
          {order.difficulty}
        </div>
      )}
      <div className="order-emoji">{order.emoji}</div>
      <div className="order-name">{order.name}</div>
      <div className="order-status">
        {order.status === 'completed' && '✅ Synthesized'}
        {order.status === 'failed' && `❌ ${order.servedDish}`}
        {order.status === 'in_progress' && '🔄 Started'}
        {order.status === 'not_started' && 'Not started'}
      </div>
      {order.status === 'not_started' && (
        <button
          className="order-button"
          onClick={() => onPickUp(order.id)}
          disabled={isDisabled}
        >
          Start
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Add Target Card Component
// ============================================================================

interface AddOrderCardProps {
  onAddOrder: (orderName: string) => void;
  isDisabled?: boolean;
}

function AddOrderCard({ onAddOrder, isDisabled }: AddOrderCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [orderName, setOrderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (orderName.trim()) {
      onAddOrder(orderName.trim());
      setOrderName('');
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setOrderName('');
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <div
        className={`order-card add-order-card ${isDisabled ? 'disabled' : ''}`}
        onClick={() => !isDisabled && setIsEditing(true)}
      >
        <div className="order-emoji">📋</div>
        <div className="order-name">Add New Target</div>
        <div className="order-status">{isDisabled ? 'Click to add' : 'Click to add'}</div>
      </div>
    );
  }

  return (
    <div className="order-card add-order-card editing">
      <div className="order-emoji">📋</div>
      <input
        ref={inputRef}
        type="text"
        className="order-input"
        placeholder="Enter molecule name..."
        value={orderName}
        onChange={(e) => setOrderName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!orderName.trim()) {
            setIsEditing(false);
          }
        }}
      />
      <button className="synthesis-button" onClick={handleSubmit} disabled={!orderName.trim()}>
        ➕ Add Target
      </button>
    </div>
  );
}

// ============================================================================
// Combination Agent Component (Layer 1)
// ============================================================================

interface CombinationAgentProps {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  timeline: TimelineEntry[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineEntry[]>>;
  selectedIngredients: Set<string>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  activeAction: string | null;
  setActiveAction: React.Dispatch<React.SetStateAction<string | null>>;
  actionTriggerCount: number;
  onExecuteActionRef: React.MutableRefObject<((action: LabAction, ingredients: string[]) => Promise<Ingredient | null>) | null>;
  orders: Order[];
  onSynthesizeWithGemini: (orderName: string) => void;
  onPickUp: (orderId: string) => void;
  onAddOrder: (orderName: string) => void;
  onServe: (servedDishName: string) => void;
  onOpenCombinationAgent: () => void;
  onOpenSynthesisAgent: () => void;
  onOpenVerificationAgent: () => void;
  activeIngredients: Set<string>;
  setActiveIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  isSynthesizing: boolean;
  isSynthesisAgentOpen: boolean;
  isAlchemyAgentOpen: boolean;
  isJudgeAgentOpen: boolean;
}

function CombinationAgent({
  inventory,
  setInventory,
  timeline,
  setTimeline,
  selectedIngredients,
  setSelectedIngredients,
  activeAction,
  setActiveAction,
  actionTriggerCount,
  onExecuteActionRef,
  orders,
  onSynthesizeWithGemini,
  onPickUp,
  onAddOrder,
  onServe,
  onOpenCombinationAgent,
  onOpenSynthesisAgent,
  onOpenVerificationAgent,
  activeIngredients,
  setActiveIngredients,
  isSynthesizing,
  isSynthesisAgentOpen,
  isAlchemyAgentOpen,
  isJudgeAgentOpen,
}: CombinationAgentProps) {
  const { generateContent, setConfig } = useGeminiAPIContext();
  const [show3D, setShow3D] = useState(true);

  // Refs for auto-scroll
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const prevInventoryLengthRef = useRef(inventory.length);

  // Set config on mount
  useEffect(() => {
    setConfig({
      systemInstruction: COMBINATION_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: COMBINATION_RESPONSE_SCHEMA,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    });
  }, [setConfig]);

  // Toggle ingredient selection
  const toggleIngredient = useCallback((name: string) => {
    setSelectedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, [setSelectedIngredients]);

  // Core execution logic - shared with Synthesis Agent
  const executeCombination = useCallback(async (
    action: LabAction,
    ingredientNames: string[]
  ): Promise<Ingredient | null> => {
    try {
      const prompt = `Action: ${action.displayName}\nIngredients: ${ingredientNames.join(', ')}\n\nWhat is the result of this lab action?`;

      const contents: Content[] = [
        { role: 'user', parts: [{ text: prompt }] }
      ];

      const response = await generateContent(contents);
      const text = response?.text || '{}';
      const result: CombinationResult = JSON.parse(text);

      return {
        name: result.result_name,
        emoji: result.emoji,
      };
    } catch (error) {
      console.error('Error in combination:', error);
      return null;
    }
  }, [generateContent]);

  // Expose the execution function to Synthesis Agent via ref
  useEffect(() => {
    onExecuteActionRef.current = executeCombination;
    return () => {
      onExecuteActionRef.current = null;
    };
  }, [executeCombination, onExecuteActionRef]);

  // Manual execution (UI click)
  const executeAction = useCallback(async (action: LabAction) => {
    if (selectedIngredients.size === 0) return;

    const ingredientNames = Array.from(selectedIngredients);

    // Clear selection immediately
    setSelectedIngredients(new Set());

    // Handle serve action specially - only triggers verification, no combination
    if (action.name === 'serve') {
      // Serve takes only the first selected ingredient as the molecule name
      const dishName = ingredientNames[0];

      // Add serve to timeline
      setTimeline(prev => [...prev, {
        id: `serve-${Date.now()}`,
        type: 'text' as const,
        action: '',
        ingredients: [],
        result: null,
        text: `🔬 Submitted: ${dishName}`,
        timestamp: new Date(),
      }]);

      // Trigger verification agent
      onServe(dishName);
      return;
    }

    // Regular lab actions - use combination agent
    const timelineId = `${Date.now()}`;

    // Add loading placeholder to timeline
    const loadingEntry: TimelineEntry = {
      id: timelineId,
      timestamp: new Date(),
      action: action.name,
      ingredients: ingredientNames,
      result: null,
    };
    setTimeline(prev => [...prev, loadingEntry]);
    setActiveAction(action.name);
    setActiveIngredients(new Set(ingredientNames));

    const newIngredient = await executeCombination(action, ingredientNames);

    if (newIngredient) {
      // Update timeline with result
      setTimeline(prev => prev.map(entry =>
        entry.id === timelineId
          ? { ...entry, result: newIngredient }
          : entry
      ));

      // Add to inventory (at the beginning for recently used items at top)
      // But skip if this ingredient already exists (duplicate check)
      setInventory(prev => {
        if (isDuplicateIngredient(newIngredient.name, prev)) {
          console.log(`Skipping duplicate ingredient: ${newIngredient.name}`);
          return prev;
        }
        return [newIngredient, ...prev];
      });
    } else {
      // Update timeline with error
      setTimeline(prev => prev.map(entry =>
        entry.id === timelineId
          ? { ...entry, result: { name: 'error', emoji: '❌' } }
          : entry
      ));
    }

    setActiveAction(null);
    setActiveIngredients(new Set());
  }, [selectedIngredients, executeCombination, setTimeline, setActiveAction, setActiveIngredients, setSelectedIngredients, setInventory, onServe]);

  // Auto-scroll timeline when new item added
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
    }
  }, [timeline.length]);

  // Auto-scroll ingredients and tools sections on first load to show length
  useEffect(() => {
    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;

    // Small delay to ensure elements are rendered
    const timer = setTimeout(() => {
      if (ingredientsRef.current) {
        ingredientsRef.current.scrollTo({
          top: ingredientsRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
      if (actionsRef.current) {
        actionsRef.current.scrollTo({
          top: actionsRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Scroll new ingredient into view when added
  useEffect(() => {
    if (inventory.length > prevInventoryLengthRef.current && ingredientsRef.current) {
      // New ingredient was added at the beginning - scroll to top
      ingredientsRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    prevInventoryLengthRef.current = inventory.length;
  }, [inventory.length]);

  // Scroll active tool into view when action is triggered (container-only scroll)
  useEffect(() => {
    // Only run when trigger count changes (indicates a new action)
    if (actionTriggerCount === 0) return;

    requestAnimationFrame(() => {
      const container = actionsRef.current;
      if (!container || !activeAction) return;
      const actionElement = container.querySelector(`[data-action="${activeAction}"]`) as HTMLElement;
      if (actionElement) {
        // Calculate scroll position within container only
        const containerRect = container.getBoundingClientRect();
        const elementRect = actionElement.getBoundingClientRect();
        const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - containerRect.height / 2 + elementRect.height / 2;
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionTriggerCount, activeAction]);





  const hasSelection = selectedIngredients.size > 0;

  // Get the current in-progress order name
  const currentOrder = orders.find(o => o.status === 'in_progress');

  return (
    <div className="lab-app">
      {/* Page Title */}
      <div className="lab-header">
        <h1 className="lab-title">Function Calling Lab</h1>
        <p className="lab-subtitle">Challenge Gemini 3 Flash's function calling capabilities:</p>
      </div>

      {/* Challenge Banner */}
      <div className="challenge-banner">
        <div className="challenge-title">🧪 ULTIMATE CHEMISTRY CHALLENGE! 🧪</div>
        <div className="challenge-subtitle">Sequence tasks from 100 tools and 100 chemicals to synthesize a molecule</div>
      </div>

      {/* Orders Section */}
      <section className="lab-section orders-section">
        <div className="section-header">
          <div className="section-header-text">
            <h2 className="section-title">Target Molecules</h2>
            <p className="section-subtitle">Target molecules to synthesize with function calling</p>
          </div>
        </div>
        <div className="orders-grid">
          {(() => {
            const hasInProgressOrder = orders.some(o => o.status === 'in_progress');
            return (
              <>
                {orders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isDisabled={hasInProgressOrder && order.status === 'not_started'}
                    onPickUp={onPickUp}
                    onSynthesizeWithGemini={onSynthesizeWithGemini}
                    onOpenVerificationAgent={onOpenVerificationAgent}
                  />
                ))}
                <AddOrderCard onAddOrder={onAddOrder} isDisabled={hasInProgressOrder} />
              </>
            );
          })()}
        </div>
      </section>

      {/* Lab Window Section */}
      <section className="lab-section lab-window-section">
        <div className="section-header">
          <div className="section-header-text">
            <h2 className="section-title">Lab Window</h2>
            <p className="section-subtitle">Watch the chemist at work</p>
          </div>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${!show3D ? 'active' : ''}`}
              onClick={() => setShow3D(false)}
            >
              2D
            </button>
            <button
              className={`toggle-btn ${show3D ? 'active' : ''}`}
              onClick={() => setShow3D(true)}
            >
              3D
            </button>
          </div>
        </div>
        <div className={`lab-window ${show3D ? 'three-d' : ''}`}>
          {show3D ? (
            <div className="three-d-canvas-container">
              <LabScene
                activeIngredients={Array.from(activeIngredients)}
                activeAction={activeAction}
                selectedIngredients={Array.from(selectedIngredients)}
                onWebGLFailure={() => setShow3D(false)}
              />
            </div>
          ) : (
            <>
              <div className="chemist-character">
                {activeAction ? '🧑‍🔬' : '👨‍🔬'}
              </div>
              <div className="mixing-area">
                {activeAction ? (
                  <div className="mixing-animation">
                    <span className="mixing-action">{LAB_ACTIONS.find(a => a.name === activeAction)?.emoji}</span>
                    <span className="mixing-ingredients">
                      {Array.from(activeIngredients).map(name => {
                        const ing = inventory.find(i => i.name === name);
                        return ing ? ing.emoji : '🧪';
                      }).join(' + ')}
                    </span>
                  </div>
                ) : (
                  <div className="idle-state">Waiting for instructions...</div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Ingredients and Tools Side by Side */}
      <div className="ingredients-tools-row">
        {/* Ingredients Section */}
        <section className="lab-section ingredients-section">
          <div className="section-header">
            <div className="section-header-text">
              <h2 className="section-title">Chemicals</h2>
              <p className="section-subtitle">Select chemicals to use as function arguments</p>
            </div>
            <span className="section-count">count: {inventory.length}</span>
          </div>
          <div className="ingredients-grid" ref={ingredientsRef}>
            {inventory.map((ingredient, index) => (
              <IngredientTile
                key={`${ingredient.name}-${index}-${actionTriggerCount}`}
                ingredient={ingredient}
                isSelected={selectedIngredients.has(ingredient.name)}
                isActive={activeIngredients.has(ingredient.name)}
                isDisabled={!currentOrder}
                onClick={() => toggleIngredient(ingredient.name)}
              />
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="lab-section actions-section">
          <div className="section-header">
            <div className="section-header-text">
              <h2 className="section-title">Lab Tools</h2>
              <p className="section-subtitle">Use function calls to combine chemicals</p>
            </div>
            <span className="section-count">count: {LAB_ACTIONS.length}</span>
          </div>
          <div className="actions-grid" ref={actionsRef}>
            {LAB_ACTIONS.map(action => {
              // Serve requires exactly one ingredient selected
              const isServeDisabled = action.name === 'serve' && selectedIngredients.size !== 1;
              // Don't disable tools while synthesis agent is running
              const isDisabled = isSynthesizing ? false : (!hasSelection || activeAction !== null || isServeDisabled);

              return (
                <ActionTile
                  key={`${action.name}-${actionTriggerCount}`}
                  action={action}
                  isActive={false}
                  isDisabled={isDisabled}
                  onClick={() => executeAction(action)}
                />
              );
            })}
          </div>
        </section>
      </div>

      {/* Agents Section */}
      <section className="lab-section agents-section">
        <div className="section-header">
          <div className="section-header-text">
            <h2 className="section-title">Agents</h2>
            <p className="section-subtitle">Three specialized Gemini 3 Flash agents</p>
          </div>
        </div>
        <div className="agents-grid">
          {/* Synthesis Agent - Double Width */}
          <div className="agent-card agent-card-wide">
            <div className="agent-card-header">
              <span className="agent-emoji">🧑‍🔬</span>
              <span className="agent-name">Synthesis Agent</span>
            </div>
            <p className="agent-description">Orchestrates synthesis using available tools and chemicals</p>
            <div className="agent-actions">
              <button
                className="agent-synthesis-button"
                onClick={() => currentOrder && onSynthesizeWithGemini(currentOrder.name)}
                disabled={!currentOrder || isSynthesizing}
              >
                {isSynthesizing ? 'Synthesizing...' : currentOrder ? `Start synthesizing '${currentOrder.name}'` : 'Start a target'}
              </button>
              <button
                className="agent-view-button"
                onClick={onOpenSynthesisAgent}
                disabled={isSynthesisAgentOpen}
              >
                <span className="material-symbols-outlined">search</span>
                Open
              </button>
            </div>
          </div>

          {/* Alchemy Agent */}
          <div className="agent-card">
            <div className="agent-card-header">
              <span className="agent-emoji">⚗️</span>
              <span className="agent-name">Reaction Agent</span>
            </div>
            <p className="agent-description">Determines results of lab actions</p>
            <div className="agent-actions">
              <button
                className="agent-view-button"
                onClick={onOpenCombinationAgent}
                disabled={isAlchemyAgentOpen}
              >
                <span className="material-symbols-outlined">search</span>
                Open
              </button>
            </div>
          </div>

          {/* Judge Agent */}
          <div className="agent-card">
            <div className="agent-card-header">
              <span className="agent-emoji">🧑‍🏫</span>
              <span className="agent-name">Professor Agent</span>
            </div>
            <p className="agent-description">Verifies if synthesized molecules match targets</p>
            <div className="agent-actions">
              <button
                className="agent-view-button"
                onClick={onOpenVerificationAgent}
                disabled={isJudgeAgentOpen}
              >
                <span className="material-symbols-outlined">search</span>
                Open
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="lab-section timeline-section">
        <div className="section-header">
          <div className="section-header-text">
            <h2 className="section-title">Lab Log</h2>
            <p className="section-subtitle">Chat history showing all lab actions and results</p>
          </div>
        </div>
        <div className="timeline-container" ref={timelineRef}>
          {timeline.length === 0 ? (
            <div className="timeline-empty">
              Select chemicals and click an action to start synthesizing
            </div>
          ) : (
            timeline.map(entry => (
              <TimelineItem key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </section>

      {/* Equipment Catalog Section */}
      <EquipmentCatalog />
    </div>
  );
}

// ============================================================================
// Synthesis Agent Component (Layer 2)
// ============================================================================

interface SynthesisAgentProps {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setTimeline: React.Dispatch<React.SetStateAction<TimelineEntry[]>>;
  setActiveAction: React.Dispatch<React.SetStateAction<string | null>>;
  setActionTriggerCount: React.Dispatch<React.SetStateAction<number>>;
  setActiveIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  executeCombinationRef: React.MutableRefObject<((action: LabAction, ingredients: string[]) => Promise<Ingredient | null>) | null>;
  sendMessageRef: React.MutableRefObject<((message: string) => void) | null>;
  onServe: (servedDishName: string) => Promise<boolean>;
  onPass: () => void;
}

function SynthesisAgent({
  inventory,
  setInventory,
  setTimeline,
  setActiveAction,
  setActionTriggerCount,
  setActiveIngredients,
  executeCombinationRef,
  sendMessageRef,
  onServe,
  onPass,
}: SynthesisAgentProps) {
  const { client, setConfig, sendMessage } = useGeminiAPIContext();

  // Update config when inventory changes - enable thinking for synthesis agent
  useEffect(() => {
    setConfig({
      systemInstruction: buildSynthesisAgentSystemInstruction(inventory),
      tools: generateLabTools(),
      // No thinkingBudget - enable thinking for synthesis agent
    });
  }, [setConfig, inventory]);

  // Store pending text from model response to merge with function call
  const pendingTextRef = useRef<string | null>(null);

  // Watch for model responses and store text for merging
  useEffect(() => {
    const handleLog = (log: any) => {
      // Only process incoming send-message responses
      if (log.type !== 'send-message' || log.direction !== 'receive') return;

      const response = log.message;
      if (!response) return;

      // Extract text from response
      const text = response.text;
      if (text && text.trim()) {
        // Check if this response also has function calls
        const hasFunctionCalls = response.candidates?.[0]?.content?.parts?.some(
          (part: any) => part.functionCall
        ) || response.functionCalls?.length > 0;

        if (hasFunctionCalls) {
          // Store text to merge with function call entry
          pendingTextRef.current = text;
        } else {
          // Text-only response, add as standalone entry
          setTimeline(prev => {
            // Check if we already have this text (avoid duplicates)
            const hasText = prev.some(e => e.text === text && !e.action);
            if (hasText) return prev;

            return [...prev, {
              id: `text-${Date.now()}-${Math.random()}`,
              timestamp: new Date(),
              text: text,
            }];
          });
        }
      }
    };

    // Listen for log events
    (client as any).on('log', handleLog);
    return () => {
      (client as any).off('log', handleLog);
    };
  }, [client, setTimeline]);

  // Handle approved function calls from the Synthesis Agent
  useEffect(() => {
    const handleApprovedFunctionCalls = async (functionCalls: FunctionCall[]) => {
      if (functionCalls.length === 0) return;

      try {
        // Process only the first function call (enforce one at a time)
        const fc = functionCalls[0];
        if (functionCalls.length > 1) {
          console.warn('Synthesis Agent returned multiple function calls, only processing the first one');
        }

        const actionName = fc.name || '';
        const args = fc.args as { ingredients?: string[]; dish?: string } || {};

        // Handle serve action
        if (actionName === 'serve') {
          const dishName = args.dish || 'molecule';
          console.log(`🔬 Submitting: ${dishName}`);

          // Add serve to timeline
          setTimeline(prev => [...prev, {
            id: `serve-${Date.now()}`,
            timestamp: new Date(),
            text: `🔬 Submitted: ${dishName}`,
          }]);

          // Trigger verification agent and wait for result
          const verificationSuccess = await onServe(dishName);

          // Send function response based on verification result
          await sendMessage([{
            functionResponse: {
              name: 'serve',
              response: verificationSuccess
                ? { success: true, message: `${dishName} has been submitted and verified!` }
                : { success: false, error: `${dishName} did not match any pending target. Please try again.` }
            }
          }]);
          return;
        }

        // Handle pass action - give up on current order
        if (actionName === 'pass') {
          console.log('🏳️ Passing on current order');

          // Notify parent to mark the current order as failed
          onPass();

          // Add pass to timeline
          setTimeline(prev => [...prev, {
            id: `pass-${Date.now()}`,
            timestamp: new Date(),
            text: '🏳️ Called pass on the order',
          }]);

          // Send function response confirming the pass
          await sendMessage([{
            functionResponse: {
              name: 'pass',
              response: { success: true, message: 'Order has been abandoned.' }
            }
          }]);
          return;
        }

        // Handle synthesis actions
        const requestedIngredients = args.ingredients || [];
        const timelineId = `synthesis-${Date.now()}`;

        // Find the action
        const action = LAB_ACTIONS.find(a => a.name === actionName);
        if (!action) {
          console.error(`Unknown action: ${actionName}`);
          await sendMessage([{
            functionResponse: {
              name: actionName,
              response: { success: false, error: `Unknown action: ${actionName}` }
            }
          }]);
          return;
        }

        // Validate all requested ingredients exist in inventory (case/spacing/symbol insensitive)
        const validatedIngredients: string[] = [];
        const missingIngredients: string[] = [];
        for (const requestedName of requestedIngredients) {
          const found = resolveIngredientName(requestedName, inventory);
          if (found) {
            // Use the actual inventory name (normalized match found)
            // Avoid adding duplicates to the validated list
            const normalizedFound = normalizeIngredientName(found.name);
            if (!validatedIngredients.some(v => normalizeIngredientName(v) === normalizedFound)) {
              validatedIngredients.push(found.name);
            }
          } else {
            missingIngredients.push(requestedName);
          }
        }

        // If any ingredients are missing, send an error response
        if (missingIngredients.length > 0) {
          console.error(`Ingredients not found in inventory: ${missingIngredients.join(', ')}`);
          await sendMessage([{
            functionResponse: {
              name: actionName,
              response: {
                success: false,
                error: `Ingredients not found in inventory: ${missingIngredients.join(', ')}. Please only use ingredients that exist in the current inventory.`
              }
            }
          }]);
          return;
        }

        // Use validated ingredients (with actual inventory names) going forward
        const ingredients = validatedIngredients;

        // Add loading placeholder (include any pending text from model response)
        const pendingText = pendingTextRef.current;
        pendingTextRef.current = null; // Clear pending text

        const loadingEntry: TimelineEntry = {
          id: timelineId,
          timestamp: new Date(),
          text: pendingText || undefined,
          action: actionName,
          ingredients: ingredients,
          result: null,
        };
        setTimeline(prev => [...prev, loadingEntry]);
        setActiveAction(actionName);
        setActionTriggerCount(prev => prev + 1);
        setActiveIngredients(new Set(ingredients));

        try {
          // Call the Combination Agent via the shared ref
          let newIngredient: Ingredient | null = null;

          if (executeCombinationRef.current) {
            newIngredient = await executeCombinationRef.current(action, ingredients);
          }

          if (!newIngredient) {
            // Fallback if combination agent unavailable
            newIngredient = {
              name: `${action.displayName}ed ${ingredients.join(' & ')}`,
              emoji: action.emoji,
            };
          }

          // Update timeline
          setTimeline(prev => prev.map(entry =>
            entry.id === timelineId
              ? { ...entry, result: newIngredient }
              : entry
          ));

          // Add to inventory (at the beginning for recently used items at top)
          // But skip if this ingredient already exists (duplicate check)
          setInventory(prev => {
            if (isDuplicateIngredient(newIngredient!.name, prev)) {
              console.log(`Skipping duplicate ingredient: ${newIngredient!.name}`);
              return prev;
            }
            return [newIngredient!, ...prev];
          });

          // Send function response back to Synthesis Agent
          await sendMessage([{
            functionResponse: {
              name: actionName,
              response: {
                success: true,
                result: newIngredient.name,
                emoji: newIngredient.emoji,
                inventory_updated: true
              }
            }
          }]);

        } catch (error) {
          console.error('Error handling synthesis action:', error);

          const errorMessage = error instanceof Error ? error.message : String(error);
          const isRateLimit = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');

          setTimeline(prev => prev.map(entry =>
            entry.id === timelineId
              ? { ...entry, result: { name: isRateLimit ? 'Rate Limit Exceeded' : 'Error', emoji: '⚠️' } }
              : entry
          ));

          try {
            // Send error response
            await sendMessage([{
              functionResponse: {
                name: actionName,
                response: { success: false, error: errorMessage }
              }
            }]);
          } catch (sendError) {
            console.error('Failed to send error response (likely due to rate limit):', sendError);
          }
        } finally {
          setActiveAction(null);
          setActiveIngredients(new Set());
        }
      } catch (globalError) {
        console.error('Global error in handleApprovedFunctionCalls:', globalError);
        const errorMessage = globalError instanceof Error ? globalError.message : String(globalError);
        if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          setTimeline(prev => [...prev, {
            id: `error-${Date.now()}`,
            timestamp: new Date(),
            text: '⚠️ Rate Limit Exceeded. Please wait a moment and try again.',
          }]);
        }
      }
    };

    // Subscribe to function call events
    (client as any).on('approvedfunctioncalls', handleApprovedFunctionCalls);
    return () => {
      (client as any).off('approvedfunctioncalls', handleApprovedFunctionCalls);
    };
  }, [client, sendMessage, setTimeline, setActiveAction, setActionTriggerCount, setActiveIngredients, setInventory, executeCombinationRef, onServe, onPass, inventory]);

  // Expose sendMessage function via ref for external triggering
  useEffect(() => {
    sendMessageRef.current = async (message: string) => {
      try {
        await sendMessage([{ text: message }]);
      } catch (error) {
        console.error('Failed to send message to Synthesis Agent:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          setTimeline(prev => [...prev, {
            id: `error-${Date.now()}`,
            timestamp: new Date(),
            text: '⚠️ Rate Limit Exceeded. Please wait a moment and try again.',
          }]);
        }
      }
    };
    return () => {
      sendMessageRef.current = null;
    };
  }, [sendMessage, sendMessageRef, setTimeline]);

  // This component doesn't render anything - it just handles the Synthesis Agent logic
  return null;
}

// ============================================================================
// Verification Agent Component (Layer 3)
// ============================================================================

interface VerificationAgentProps {
  orders: Order[];
  inventory: Ingredient[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setTimeline: React.Dispatch<React.SetStateAction<TimelineEntry[]>>;
  verifyServedDishRef: React.MutableRefObject<((servedDishName: string) => Promise<boolean>) | null>;
}

function VerificationAgent({
  orders,
  inventory,
  setOrders,
  setTimeline,
  verifyServedDishRef,
}: VerificationAgentProps) {
  const { generateContent, setConfig } = useGeminiAPIContext();

  // Use refs to always access the current values (avoids stale closure)
  const ordersRef = useRef(orders);
  const inventoryRef = useRef(inventory);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);
  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);

  // Set config on mount
  useEffect(() => {
    setConfig({
      systemInstruction: VERIFICATION_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: VERIFICATION_RESPONSE_SCHEMA,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    });
  }, [setConfig]);

  // Expose verification function via ref
  useEffect(() => {
    verifyServedDishRef.current = async (servedDishName: string) => {
      // Use ref to get current orders (avoids stale closure)
      const currentOrders = ordersRef.current;

      // Find in_progress orders to check against
      const inProgressOrders = currentOrders.filter(o => o.status === 'in_progress');

      if (inProgressOrders.length === 0) {
        // No active order - return success without running verification
        setTimeline(prev => [...prev, {
          id: `verify-noorder-${Date.now()}`,
          type: 'text' as const,
          action: '',
          ingredients: [],
          result: null,
          text: `✅ Submitted "${servedDishName}" (no active target)`,
          timestamp: new Date(),
        }]);
        return true; // Success, but no order to verify against
      }

      // Check each pending order for a match
      for (const order of inProgressOrders) {
        try {
          const prompt = `Target Molecule: "${order.name}"\nSynthesized Molecule: "${servedDishName}"\n\nDoes this synthesized molecule match the target?`;

          const contents: Content[] = [
            { role: 'user', parts: [{ text: prompt }] }
          ];

          const response = await generateContent(contents);
          const text = response?.text || '{}';
          const result: VerificationResult = JSON.parse(text);

          if (result.matches && result.confidence > 0.7) {
            // Look up the emoji from inventory for the served dish
            const servedIngredient = resolveIngredientName(servedDishName, inventoryRef.current);
            const servedEmoji = servedIngredient?.emoji || '✅';

            // Match found! Update order to completed with the served dish's emoji
            setOrders(prev => prev.map(o =>
              o.id === order.id
                ? { ...o, status: 'completed' as const, emoji: servedEmoji }
                : o
            ));

            // Add success to timeline
            setTimeline(prev => [...prev, {
              id: `verify-${Date.now()}`,
              type: 'text' as const,
              action: '',
              ingredients: [],
              result: null,
              text: `✅ Correct!`,
              timestamp: new Date(),
            }]);

            return true; // Found a match, return success
          }
        } catch (error) {
          console.error('Error verifying order:', error);
        }
      }

      // No match found - keep order in_progress so model can try again
      // Add failure to timeline
      setTimeline(prev => [...prev, {
        id: `verify-fail-${Date.now()}`,
        type: 'text' as const,
        action: '',
        ingredients: [],
        result: null,
        text: `❌ Incorrect: "${servedDishName}" doesn't match "${inProgressOrders[0].name}"`,
        timestamp: new Date(),
      }]);

      return false; // No match found, but order stays active
    };

    return () => {
      verifyServedDishRef.current = null;
    };
  }, [generateContent, setOrders, setTimeline, verifyServedDishRef]);

  // This component doesn't render anything
  return null;
}

// ============================================================================
// Lab App Container (Shared State)
// ============================================================================

function LabAppContainer() {
  // Shared state lifted up to be accessible by both agents
  const [inventory, setInventory] = useState<Ingredient[]>(STARTING_INGREDIENTS);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set(PRESELECTED_INGREDIENTS)
  );
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [actionTriggerCount, setActionTriggerCount] = useState(0);
  const [activeIngredients, setActiveIngredients] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<Order[]>(EXAMPLE_ORDERS);

  // Overlay open states - start closed
  const [combinationAgentOpen, setCombinationAgentOpen] = useState(false);
  const [synthesisAgentOpen, setSynthesisAgentOpen] = useState(false);
  const [verificationAgentOpen, setVerificationAgentOpen] = useState(false);

  // Synthesis state - track if the synthesis agent is actively working
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Ref to share the Combination Agent's execute function
  const executeCombinationRef = useRef<((action: LabAction, ingredients: string[]) => Promise<Ingredient | null>) | null>(null);

  // Ref to trigger synthesis agent from order buttons
  const sendSynthesisMessageRef = useRef<((message: string) => void) | null>(null);

  // Ref to trigger verification agent
  const verifyServedDishRef = useRef<((servedDishName: string) => Promise<boolean>) | null>(null);

  // Callback for "Synthesize with Gemini" button - also opens Synthesis Agent overlay (except on mobile)
  const handleSynthesizeWithGemini = useCallback((orderName: string) => {
    setIsSynthesizing(true); // Set synthesis state immediately
    // Open Synthesis Agent and close others (only one agent window at a time)
    // Skip auto-opening on mobile to avoid obscuring the main UI
    const isMobile = window.innerWidth < 600;
    if (!isMobile) {
      setSynthesisAgentOpen(true);
      setCombinationAgentOpen(false);
      setVerificationAgentOpen(false);
    }
    if (sendSynthesisMessageRef.current) {
      sendSynthesisMessageRef.current(`Please synthesize: ${orderName}`);
    }
  }, []);

  // Verification callback - called when serve() is invoked, returns success/failure
  const handleVerifyServedDish = useCallback(async (servedDishName: string): Promise<boolean> => {
    if (verifyServedDishRef.current) {
      const result = await verifyServedDishRef.current(servedDishName);
      setIsSynthesizing(false); // Clear synthesis state after verification
      return result;
    }
    setIsSynthesizing(false);
    return false;
  }, []);

  // Callback for adding a new custom order
  const handleAddOrder = useCallback((orderName: string) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      name: orderName,
      emoji: '📋', // Empty notepad emoji for new orders
      status: 'not_started',
      difficulty: 'easy',
    };
    // Deselect any in_progress or failed orders, then add the new one
    setOrders(prev => [
      ...prev.map(order =>
        order.status === 'in_progress' || order.status === 'failed'
          ? { ...order, status: order.status === 'in_progress' ? 'not_started' as const : order.status }
          : order
      ),
      newOrder
    ]);
  }, []);

  // Callback for picking up an order (changes to in_progress)
  const handlePickUp = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      // The order being picked up becomes in_progress
      if (order.id === orderId) {
        return { ...order, status: 'in_progress' as const };
      }
      // Any other in_progress order gets reset to not_started
      if (order.status === 'in_progress') {
        return { ...order, status: 'not_started' as const };
      }
      return order;
    }));
  }, []);

  // Callback for passing on an order (marks it as failed)
  const handlePass = useCallback(() => {
    setOrders(prev => prev.map(order =>
      order.status === 'in_progress'
        ? { ...order, status: 'failed' as const, servedDish: 'Gave up' }
        : order
    ));
  }, []);

  return (
    <div className="app-container">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      {/* Combination Agent (Layer 1) - for manual synthesis */}
      <GeminiAPIProvider>
        <CombinationAgent
          inventory={inventory}
          setInventory={setInventory}
          timeline={timeline}
          setTimeline={setTimeline}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          actionTriggerCount={actionTriggerCount}
          activeIngredients={activeIngredients}
          setActiveIngredients={setActiveIngredients}
          onExecuteActionRef={executeCombinationRef}
          orders={orders}
          onSynthesizeWithGemini={handleSynthesizeWithGemini}
          onPickUp={handlePickUp}
          onAddOrder={handleAddOrder}
          onServe={handleVerifyServedDish}
          onOpenCombinationAgent={() => {
            setCombinationAgentOpen(true);
            setSynthesisAgentOpen(false);
            setVerificationAgentOpen(false);
          }}
          onOpenSynthesisAgent={() => {
            setSynthesisAgentOpen(true);
            setCombinationAgentOpen(false);
            setVerificationAgentOpen(false);
          }}
          onOpenVerificationAgent={() => {
            setVerificationAgentOpen(true);
            setCombinationAgentOpen(false);
            setSynthesisAgentOpen(false);
          }}
          isSynthesizing={isSynthesizing}
          isSynthesisAgentOpen={synthesisAgentOpen}
          isAlchemyAgentOpen={combinationAgentOpen}
          isJudgeAgentOpen={verificationAgentOpen}
        />
        <GeminiDebug
          agentName="Alchemy Agent"
          isOpen={combinationAgentOpen}
          onClose={() => setCombinationAgentOpen(false)}
          welcomeMessage="I determine the result of lab actions. I can't see the open targets, so I don't always return what you expect! Select a chemical + tool to see me work!"
          placeholder="Ask about ingredient combinations..."
          showApprovalSelector={false}
        />
      </GeminiAPIProvider>

      {/* Synthesis Agent (Layer 2) - for automated synthesis via debug console */}
      <GeminiAPIProvider>
        <SynthesisAgent
          inventory={inventory}
          setInventory={setInventory}
          setTimeline={setTimeline}
          setActiveAction={setActiveAction}
          setActionTriggerCount={setActionTriggerCount}
          setActiveIngredients={setActiveIngredients}
          executeCombinationRef={executeCombinationRef}
          sendMessageRef={sendSynthesisMessageRef}
          onServe={handleVerifyServedDish}
          onPass={handlePass}
        />
        <GeminiDebug
          agentName="Synthesis Agent"
          isOpen={synthesisAgentOpen}
          onClose={() => setSynthesisAgentOpen(false)}
          welcomeMessage="I synthesize with function calls. Click 'Start synthesizing' to start a target, or type a molecule!"
          placeholder="Type a molecule to synthesize..."
          initialAutoApprove={true}
          showApprovalSelector={true}
        />
      </GeminiAPIProvider>

      {/* Verification Agent (Layer 3) - for checking submitted molecules */}
      <GeminiAPIProvider>
        <VerificationAgent
          orders={orders}
          inventory={inventory}
          setOrders={setOrders}
          setTimeline={setTimeline}
          verifyServedDishRef={verifyServedDishRef}
        />
        <GeminiDebug
          agentName="Judge Agent"
          isOpen={verificationAgentOpen}
          onClose={() => setVerificationAgentOpen(false)}
          welcomeMessage="I verify if submitted molecules match pending targets. I'm triggered automatically when a molecule is submitted."
          placeholder="Ask about target verification..."
          showApprovalSelector={false}
        />
      </GeminiAPIProvider>

      {/* Attribution Footer */}
      <footer className="attribution-footer">
        Ideas/feedback:{' '}
        <a href="https://x.com/cobley_ben" target="_blank" rel="noopener noreferrer">
          cobley_ben@
        </a>
      </footer>
    </div>
  );
}

// ============================================================================
// App Component
// ============================================================================

function App() {
  return <LabAppContainer />;
}

export default App;
