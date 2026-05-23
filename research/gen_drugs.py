import os

drugs = {
    "Aripiprazole": {"formula": "C23H27Cl2N3O2", "mass": 448, "mp": 139, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to off-white crystalline powder. Antipsychotic agent for schizophrenia. Partial dopamine agonist. Practically insoluble in water."},
    "Quinapril": {"formula": "C25H30N2O5", "mass": 438, "mp": 120, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. ACE inhibitor antihypertensive. Prodrug. Slightly soluble in water."},
    "Rabeprazole": {"formula": "C18H21N3O3S", "mass": 359, "mp": 140, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to pale yellow crystalline powder. Proton pump inhibitor. Acid labile - enteric coated formulations. Used for GERD."},
    "Risedronate": {"formula": "C7H11NO7P2", "mass": 283, "mp": "Decomposes", "bp": "Decomposes", "state": "solid", "hazard": "Irritant", "desc": "White crystalline powder. Bisphosphonate for osteoporosis. Pyridinyl ring structure. Poorly absorbed orally."},
    "Pioglitazone": {"formula": "C19H20N2O3S", "mass": 356, "mp": 184, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Thiazolidinedione antidiabetic. PPAR-gamma agonist. Practically insoluble in water."},
    "Phentermine": {"formula": "C10H15N", "mass": 149, "mp": 100, "bp": 215, "state": "solid", "hazard": "Controlled substance, stimulant", "desc": "White crystalline powder. CNS stimulant anorectic. Schedule IV controlled substance. Used for weight loss. Amine structure."},
    "Epinephrine": {"formula": "C9H13NO3", "mass": 183, "mp": 212, "bp": "Decomposes", "state": "solid", "hazard": "Toxic, vasoconstrictor", "desc": "White to brownish powder. Catecholamine hormone/neurotransmitter. Degrades on exposure to light/air. Used for anaphylaxis."},
    "Albendazole": {"formula": "C12H15N3O2S", "mass": 265, "mp": 209, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity, teratogenic", "desc": "White to off-white powder. Broad-spectrum anthelmintic. Benzimidazole carbamate. Poorly soluble in water."},
    "Spironolactone": {"formula": "C24H32O4S", "mass": 416, "mp": 198, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to light cream powder. Potassium-sparing diuretic. Steroid structure. Aldosterone antagonist. Light-sensitive."},
    "Imiquimod": {"formula": "C14H16N4", "mass": 240, "mp": 292, "bp": "Decomposes", "state": "solid", "hazard": "Irritant", "desc": "White to off-white crystalline powder. Immune response modifier. Toll-like receptor 7 agonist. Used for genital warts, actinic keratosis."},
    "Naproxen": {"formula": "C14H14O3", "mass": 230, "mp": 153, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. NSAID. Propionic acid derivative. Sold as Aleve. Analgesic, anti-inflammatory."},
    "Nitazoxanide": {"formula": "C12H9N3O5S", "mass": 307, "mp": 202, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "Yellow crystalline powder. Antiprotozoal agent. Thiazolide structure. Used for cryptosporidiosis, giardiasis."},
    "Fexofenadine": {"formula": "C32H39NO4", "mass": 501, "mp": 195, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. Second-generation antihistamine. Non-sedating. Used for allergic rhinitis, hives."},
    "Brimonidine": {"formula": "C11H10BrN5", "mass": 292, "mp": 207, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to off-white powder. Alpha-2 adrenergic agonist. Used for glaucoma (eye drops). Also for rosacea."},
    "Alprazolam": {"formula": "C17H13ClN4", "mass": 308, "mp": 228, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule IV)", "desc": "White crystalline powder. Benzodiazepine anxiolytic. Used for anxiety, panic disorder. CNS depressant. Dependence risk."},
    "Ramipril": {"formula": "C23H32N2O5", "mass": 416, "mp": 109, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. ACE inhibitor. Prodrug (converted to ramiprilat). Used for hypertension, heart failure."},
    "Glimepiride": {"formula": "C24H34N4O5S", "mass": 490, "mp": 212, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to yellow crystalline powder. Sulfonylurea antidiabetic. Stimulates insulin secretion. Used for type 2 diabetes."},
    "Zolpidem": {"formula": "C19H21N3O", "mass": 307, "mp": 196, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule IV)", "desc": "White crystalline powder. Non-benzodiazepine hypnotic. Imidazopyridine structure. Used for insomnia. Short-acting."},
    "Lubiprostone": {"formula": "C20H32F2O5", "mass": 390, "mp": 56, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. Chloride channel activator. Bicyclic fatty acid derivative. Used for chronic constipation, IBS-C."},
    "Amoxicillin": {"formula": "C16H19N3O5S", "mass": 365, "mp": 194, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity, allergen", "desc": "White crystalline powder. Beta-lactam antibiotic. Aminopenicillin. Broad-spectrum. Susceptible to beta-lactamase degradation."},
    "Amphetamine": {"formula": "C9H13N", "mass": 135, "mp": 136, "bp": 200, "state": "solid", "hazard": "Controlled substance (Schedule II)", "desc": "White crystalline powder. CNS stimulant. Used for ADHD, narcolepsy. High abuse potential. Phenethylamine structure."},
    "Testosterone": {"formula": "C19H28O2", "mass": 288, "mp": 155, "bp": 432, "state": "solid", "hazard": "Controlled substance (Schedule III)", "desc": "White crystalline powder. Primary male sex hormone. Androgen/anabolic steroid. Used in HRT. Controlled in many jurisdictions."},
    "Meclizine": {"formula": "C25H27ClN2", "mass": 391, "mp": 224, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White to yellow crystalline powder. Antihistamine/antiemetic. Used for motion sickness, vertigo. Piperazine derivative."},
    "Hydralazine": {"formula": "C8H8N4", "mass": 160, "mp": 173, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to off-white powder. Direct vasodilator antihypertensive. Hydrazinophthalazine derivative. Can cause drug-induced lupus."},
    "Donepezil": {"formula": "C24H29NO3", "mass": 379, "mp": 212, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Cholinesterase inhibitor. Used for Alzheimer's disease. Piperidine derivative. Improves cognitive function."},
    "Anastrozole": {"formula": "C17H19N5", "mass": 293, "mp": 81, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Aromatase inhibitor. Used for breast cancer. Triazole derivative. Reduces estrogen production."},
    "Azelastine": {"formula": "C22H24ClN3O", "mass": 381, "mp": 225, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. Antihistamine (H1 receptor antagonist). Used for allergic rhinitis (nasal spray). Phthalazinone derivative."},
    "Candesartan": {"formula": "C24H20N6O3", "mass": 440, "mp": 163, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. Angiotensin II receptor blocker (ARB). Used for hypertension. Tetrazole derivative. Prodrug."},
    "Lorazepam": {"formula": "C15H10Cl2N2O2", "mass": 321, "mp": 166, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule IV)", "desc": "White crystalline powder. Benzodiazepine anxiolytic. Used for anxiety, status epilepticus. CNS depressant. Medium-acting."},
    "Rosiglitazone": {"formula": "C18H19N3O3S", "mass": 357, "mp": 155, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Thiazolidinedione antidiabetic. PPAR-gamma agonist. Withdrawn in some markets (cardiac risk)."},
    "Irbesartan": {"formula": "C25H28N6O", "mass": 428, "mp": 181, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. Angiotensin II receptor blocker. Used for hypertension, diabetic nephropathy. Tetrazole structure."},
    "Moxifloxacin": {"formula": "C21H24FN3O4", "mass": 401, "mp": 130, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "Yellow crystalline powder. Fluoroquinolone antibiotic. Broad-spectrum. Used for respiratory infections. QT prolongation risk."},
    "Dutasteride": {"formula": "C27H30F6N2O2", "mass": 528, "mp": 243, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity, teratogenic", "desc": "White to pale yellow powder. 5-alpha-reductase inhibitor. Used for BPH. Contraindicated in pregnancy (male fetal development risk)."},
    "Trimethoprim": {"formula": "C14H18N4O3", "mass": 290, "mp": 199, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Dihydrofolate reductase inhibitor antibiotic. Bacteriostatic. Used with sulfamethoxazole (co-trimoxazole)."},
    "Mupirocin": {"formula": "C26H44O9", "mass": 500, "mp": 77, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White to off-white powder. Topical antibiotic. Inhibits bacterial isoleucyl-tRNA synthetase. Used for impetigo, MRSA. Pseudomonic acid."},
    "Entecavir": {"formula": "C12H15N5O3", "mass": 277, "mp": 244, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to off-white powder. Anti-hepatitis B antiviral. Guanine nucleoside analogue. Black box warning for hepatotoxicity."},
    "Olmesartan": {"formula": "C24H26N6O3", "mass": 446, "mp": 180, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. ARB antihypertensive. Prodrug. Used for hypertension. Tetrazole derivative."},
    "Dicyclomine": {"formula": "C19H35NO2", "mass": 309, "mp": 164, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. Antimuscarinic/antispasmodic. Used for IBS. Tertiary amine structure. CNS side effects possible."},
    "Clarithromycin": {"formula": "C38H69NO13", "mass": 748, "mp": 220, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white crystalline powder. Macrolide antibiotic. Broad-spectrum. Used for respiratory infections. CYP3A4 inhibitor."},
    "Ibandronate": {"formula": "C9H23NO7P2", "mass": 319, "mp": "Decomposes", "bp": "Decomposes", "state": "solid", "hazard": "Irritant", "desc": "White crystalline powder. Bisphosphonate for osteoporosis. Nitrogen-containing. Monthly dosing. Poor oral bioavailability."},
    "Buspirone": {"formula": "C21H31N5O2", "mass": 385, "mp": 186, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. Anxiolytic (non-benzodiazepine). 5-HT1A partial agonist. Not a controlled substance. No dependence."},
    "Exenatide": {"formula": "C184H282N50O60S", "mass": 4187, "mp": "N/A (peptide)", "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White to off-white powder (lyophilized). GLP-1 receptor agonist. Injectable antidiabetic. Synthetic peptide. Exenatide is synthetic exendin-4."},
    "Nebivolol": {"formula": "C22H25F2NO4", "mass": 405, "mp": 166, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Beta-1 selective blocker with NO-mediated vasodilation. Used for hypertension. Racemic mixture."},
    "Caffeine": {"formula": "C8H10N4O2", "mass": 194, "mp": 238, "bp": 178, "state": "solid", "hazard": "Low toxicity, stimulant", "desc": "White crystalline powder. Xanthine alkaloid. CNS stimulant. Found in coffee, tea. Generally recognized as safe (GRAS)."},
    "Verapamil": {"formula": "C27H38N2O4", "mass": 454, "mp": 143, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Calcium channel blocker (Class IV). Used for hypertension, angina, arrhythmias. Phenylalkylamine."},
    "Diltiazem": {"formula": "C22H26N2O4S", "mass": 414, "mp": 212, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to off-white crystalline powder. Calcium channel blocker (non-dihydropyridine). Used for hypertension, angina. Benzothiazepine."},
    "Doxazosin": {"formula": "C23H25N5O5", "mass": 451, "mp": 289, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Alpha-1 adrenergic blocker. Used for hypertension, BPH. Quinazoline derivative. First-dose syncope risk."},
    "Carisoprodol": {"formula": "C12H24N2O4", "mass": 260, "mp": 93, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule IV)", "desc": "White crystalline powder. Skeletal muscle relaxant. Prodrug of meprobamate. CNS depressant. Used for muscle spasms."},
    "Clonidine": {"formula": "C9H9Cl2N3", "mass": 230, "mp": 130, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Alpha-2 adrenergic agonist. Used for hypertension, ADHD, opioid withdrawal. Imidazoline structure."},
    "Cefuroxime": {"formula": "C16H16N4O8S", "mass": 424, "mp": 218, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity, allergen", "desc": "White to pale yellow powder. Second-generation cephalosporin antibiotic. Broad-spectrum. Beta-lactam. Administered IV/IM or orally (axetil)."},
    "Celecoxib": {"formula": "C17H14F3N3O2S", "mass": 381, "mp": 158, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. COX-2 selective NSAID. Used for arthritis, pain. Lower GI ulcer risk than non-selective NSAIDs. Cardiovascular risk."},
    "Citalopram": {"formula": "C20H21FN2O", "mass": 324, "mp": 183, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. SSRI antidepressant. Used for depression, anxiety. Racemic mixture (escitalopram is S-enantiomer)."},
    "Varenicline": {"formula": "C13H13N3", "mass": 211, "mp": 218, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to off-white powder. Partial nicotinic receptor agonist. Used for smoking cessation. Neuropsychiatric side effects."},
    "Tadalafil": {"formula": "C22H19N3O4", "mass": 389, "mp": 302, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. PDE5 inhibitor. Used for ED, pulmonary hypertension. Longer half-life than sildenafil."},
    "Ciprofloxacin": {"formula": "C17H18FN3O3", "mass": 331, "mp": 256, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to pale yellow powder. Fluoroquinolone antibiotic. Broad-spectrum. Used for UTIs, anthrax. Tendon rupture risk."},
    "Clindamycin": {"formula": "C18H33ClN2O5S", "mass": 425, "mp": 142, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Lincosamide antibiotic. Bacteriostatic. Used for anaerobic infections, acne. C. difficile risk."},
    "Clobetasol": {"formula": "C22H28ClFO5", "mass": 427, "mp": 196, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to off-white powder. Very potent topical corticosteroid. Used for psoriasis, eczema, dermatitis. Atrophy risk with prolonged use."},
    "Cocaine": {"formula": "C17H21NO4", "mass": 303, "mp": 98, "bp": 188, "state": "solid", "hazard": "Controlled substance (Schedule II)", "desc": "White crystalline powder. Tropane alkaloid. Local anesthetic. CNS stimulant. High abuse potential. Coca leaf derivative."},
    "Benztropine": {"formula": "C21H25NO", "mass": 307, "mp": 159, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Anticholinergic agent. Used for Parkinson's disease, EPS. Tropine-diphenylmethane structure."},
    "Colchicine": {"formula": "C22H25NO6", "mass": 399, "mp": 157, "bp": "Decomposes", "state": "solid", "hazard": "Highly toxic", "desc": "Pale yellow crystalline powder. Alkaloid from Colchicum. Used for gout. Narrow therapeutic index. Mitotic inhibitor."},
    "Prochlorperazine": {"formula": "C20H24ClN3S", "mass": 374, "mp": 228, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to pale yellow powder. Phenothiazine antipsychotic/antiemetic. Dopamine antagonist. EPS risk. Used for nausea, psychosis."},
    "Carvedilol": {"formula": "C24H26N2O4", "mass": 406, "mp": 115, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Non-selective beta-blocker with alpha-1 blockade. Used for heart failure, hypertension. Antioxidant properties."},
    "Hydrocortisone": {"formula": "C21H30O5", "mass": 362, "mp": 214, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Glucocorticoid (cortisol). Natural corticosteroid. Used for inflammation, adrenal insufficiency. Anti-inflammatory."},
    "Warfarin": {"formula": "C19H16O4", "mass": 308, "mp": 161, "bp": "Decomposes", "state": "solid", "hazard": "Highly toxic, teratogenic", "desc": "White crystalline powder. Anticoagulant (vitamin K antagonist). Used for blood clot prevention. Narrow therapeutic index. Monitoring required (INR)."},
    "Losartan": {"formula": "C22H23ClN6O", "mass": 422, "mp": 184, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. ARB antihypertensive. First-in-class. Used for hypertension, diabetic nephropathy. Active metabolite."},
    "Rosuvastatin": {"formula": "C22H28FN3O6S", "mass": 481, "mp": 122, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. Statin (HMG-CoA reductase inhibitor). Used for hypercholesterolemia. Most potent statin."},
    "Cyclobenzaprine": {"formula": "C20H21N", "mass": 275, "mp": 216, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Skeletal muscle relaxant. Tricyclic amine structure. Used for muscle spasms. CNS depressant."},
    "Duloxetine": {"formula": "C18H19NOS", "mass": 297, "mp": 125, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. SNRI antidepressant. Used for depression, anxiety, fibromyalgia, neuropathic pain. Serotonin-norepinephrine reuptake inhibitor."},
    "Dexamethasone": {"formula": "C22H29FO5", "mass": 392, "mp": 262, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Potent corticosteroid. Used for inflammation, autoimmune conditions, COVID-19. Anti-inflammatory and immunosuppressive."},
    "Prednisone": {"formula": "C21H26O5", "mass": 358, "mp": 215, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Corticosteroid prodrug (converted to prednisolone). Used for inflammation, autoimmune disorders, transplant."},
    "Divalproex": {"formula": "C16H32O5 (valproate complex)", "mass": 288, "mp": "Complex", "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity, teratogenic", "desc": "White crystalline powder. Valproate semisodium. Used for epilepsy, bipolar disorder, migraine. Hepatotoxicity risk. Neural tube defect risk."},
    "Trazodone": {"formula": "C19H22ClN5O", "mass": 371, "mp": 189, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. SARI antidepressant. Used for depression, insomnia. Alpha-1 adrenergic antagonist. Serotonin antagonist/reuptake inhibitor."},
    "Tolterodine": {"formula": "C22H31NO", "mass": 325, "mp": 200, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. Antimuscarinic for overactive bladder. Used for urinary incontinence. Competitive M3 receptor antagonist."},
    "Dexlansoprazole": {"formula": "C16H14F3N3O2S", "mass": 369, "mp": 140, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Proton pump inhibitor. R-enantiomer of lansoprazole. Used for GERD. Dual delayed release formulation."},
    "Diazepam": {"formula": "C16H13ClN2O", "mass": 284, "mp": 125, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule IV)", "desc": "White crystalline powder. Benzodiazepine. Used for anxiety, seizures, muscle spasms, alcohol withdrawal. Long-acting. Metabolite (nordazepam)."},
    "Diclofenac": {"formula": "C14H11Cl2NO2", "mass": 296, "mp": 157, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. NSAID. Used for pain, inflammation. Potent prostaglandin synthesis inhibitor. Available as topical gel."},
    "Adapalene": {"formula": "C28H28O3", "mass": 412, "mp": 319, "bp": "Decomposes", "state": "solid", "hazard": "Irritant", "desc": "White crystalline powder. Third-generation topical retinoid. Used for acne. Naphthoic acid derivative. Less irritating than tretinoin."},
    "Fidaxomicin": {"formula": "C52H74Cl2O18", "mass": 1058, "mp": 160, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White to off-white powder. Macrocyclic antibiotic. Narrow-spectrum against C. difficile. Minimally absorbed orally."},
    "Fluconazole": {"formula": "C13H12F2N6O", "mass": 306, "mp": 140, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Triazole antifungal. Used for candidiasis, cryptococcal meningitis. Good CSF penetration."},
    "Phenytoin": {"formula": "C15H11N2NaO2", "mass": 274, "mp": 295, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity, teratogenic", "desc": "White crystalline powder. Antiepileptic. Hydantoin derivative. Narrow therapeutic index. Used for seizure disorders. Gingival hyperplasia side effect."},
    "Valsartan": {"formula": "C24H29N5O3", "mass": 435, "mp": 116, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. ARB antihypertensive. Used for hypertension, heart failure. Tetrazole derivative. Contains valine structure."},
    "Oxybutynin": {"formula": "C22H31NO3", "mass": 357, "mp": 129, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. Antimuscarinic for overactive bladder. Used for urinary incontinence. Tertiary amine. Also used for hyperhidrosis."},
    "DMT": {"formula": "C12H16N2", "mass": 188, "mp": 47, "bp": 160, "state": "solid", "hazard": "Controlled substance (Schedule I)", "desc": "White to off-white crystalline powder. Tryptamine psychedelic. Endogenous in trace amounts. Found in various plants. Short-acting."},
    "Dopamine": {"formula": "C8H11NO2", "mass": 153, "mp": 218, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Catecholamine neurotransmitter. Used IV for shock, hypotension. Does not cross BBB. Precursor to norepinephrine."},
    "Venlafaxine": {"formula": "C17H27NO2", "mass": 277, "mp": 216, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. SNRI antidepressant. Used for depression, anxiety. O-desmethylvenlafaxine is active metabolite. Withdrawal syndrome."},
    "Prasugrel": {"formula": "C20H20FNO3", "mass": 341, "mp": 120, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. P2Y12 platelet inhibitor. Used for acute coronary syndrome. Prodrug. More potent than clopidogrel."},
    "Amitriptyline": {"formula": "C20H23N", "mass": 277, "mp": 198, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Tricyclic antidepressant (TCA). Used for depression, neuropathic pain, migraine prevention. Anticholinergic side effects."},
    "Pentosan": {"formula": "Varies (polysulfated polysaccharide)", "mass": 4000-6000, "mp": "Decomposes", "bp": "N/A", "state": "solid", "hazard": "Low toxicity", "desc": "White to off-white powder. Semi-synthetic glycosaminoglycan. Used for interstitial cystitis. Anticoagulant activity. Polysulfated pentose polymer."},
    "Darifenacin": {"formula": "C28H30N2O2", "mass": 426, "mp": 230, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "White crystalline powder. M3 selective antimuscarinic. Used for overactive bladder. Lower CNS side effects due to selectivity."},
    "Estradiol": {"formula": "C18H24O2", "mass": 272, "mp": 178, "bp": 445, "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. Primary female sex hormone (17-beta-estradiol). Used in HRT, contraception. Steroid structure."},
    "Raloxifene": {"formula": "C28H27NO4S", "mass": 473, "mp": 258, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White crystalline powder. SERM (Selective Estrogen Receptor Modulator). Used for osteoporosis, breast cancer risk reduction. Benzothiophene derivative."},
    "Fentanyl": {"formula": "C22H28N2O", "mass": 336, "mp": 84, "bp": 355, "state": "solid", "hazard": "Controlled substance (Schedule II), extremely potent", "desc": "White crystalline powder. Synthetic opioid analgesic. Extremely potent (50-100x morphine). Used for anesthesia, chronic pain. High abuse potential."},
    "Metronidazole": {"formula": "C6H9N3O3", "mass": 171, "mp": 160, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. Nitroimidazole antibiotic/antiprotozoal. Used for anaerobic infections, trichomoniasis. Metallic taste side effect."},
    "Tamsulosin": {"formula": "C20H28N2O5S", "mass": 408, "mp": 228, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Alpha-1a selective adrenergic blocker. Used for BPH. Sulfonamide structure. First-dose hypotension risk."},
    "Fluticasone": {"formula": "C22H27F3O4S", "mass": 444, "mp": 272, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Inhaled corticosteroid. Used for asthma, COPD, allergic rhinitis. High first-pass metabolism (safer)."},
    "Dexmethylphenidate": {"formula": "C14H19NO2", "mass": 233, "mp": 221, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule II)", "desc": "White crystalline powder. CNS stimulant. d-threo enantiomer of methylphenidate. Used for ADHD. Less side effects than racemic."},
    "Folic Acid": {"formula": "C19H19N7O6", "mass": 441, "mp": 250, "bp": "Decomposes", "state": "solid", "hazard": "Low toxicity", "desc": "Yellow to orange crystalline powder. Vitamin B9. Essential for DNA synthesis. Used to prevent neural tube defects. Pteridine structure."},
    "Alendronate": {"formula": "C4H13NO7P2", "mass": 249, "mp": "Decomposes", "bp": "Decomposes", "state": "solid", "hazard": "Irritant", "desc": "White crystalline powder. Bisphosphonate for osteoporosis. Nitrogen-containing. Poor oral absorption. Must take with water, empty stomach."},
    "Ziprasidone": {"formula": "C21H21ClN4OS", "mass": 412, "mp": 213, "bp": "Decomposes", "state": "solid", "hazard": "Moderate toxicity", "desc": "White to pale yellow powder. Atypical antipsychotic. Used for schizophrenia, bipolar disorder. QT prolongation risk. Benzisothiazole structure."},
    "Metformin": {"formula": "C4H11N5", "mass": 129, "mp": 222, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Biguanide antidiabetic. First-line for type 2 diabetes. Increases insulin sensitivity. GI side effects common."},
    "Glipizide": {"formula": "C21H27N5O4S", "mass": 445, "mp": 206, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Sulfonylurea antidiabetic. Stimulates insulin secretion. Second-generation. Used for type 2 diabetes."},
    "Heroin": {"formula": "C21H23NO5", "mass": 369, "mp": 173, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule I), highly addictive", "desc": "White to brown powder. Diacetylmorphine. Semisynthetic opioid. Prodrug of morphine. High abuse potential. No medical use in US."},
    "Hydrocodone": {"formula": "C18H21NO3", "mass": 299, "mp": 198, "bp": "Decomposes", "state": "solid", "hazard": "Controlled substance (Schedule II)", "desc": "White crystalline powder. Semi-synthetic opioid analgesic. Used for pain relief. Frequently combined with acetaminophen. Abuse potential."},
    "Chlorthalidone": {"formula": "C14H11ClN2O4S", "mass": 338, "mp": 224, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White to off-white powder. Thiazide-like diuretic. Used for hypertension. Long-acting (24-72 hours). Sulfonamide structure."},
    "Terazosin": {"formula": "C19H25N5O4", "mass": 387, "mp": 272, "bp": "Decomposes", "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. Alpha-1 adrenergic blocker. Used for hypertension, BPH. Quinazoline derivative. First-dose syncope."},
}

def generate_drug_md(name, d):
    content = f"""# {name} - Chemical Compound Research

## Basic Properties
- **Molecular Formula:** {d['formula']}
- **Molecular Mass:** {d['mass']} g/mol (rounded to nearest whole number)
- **State at Room Temperature:** {'Solid' if d['state'] == 'solid' else 'Liquid'}
- **Melting Point:** {d['mp']}°C
- **Boiling Point:** {d['bp']}
- **Color:** {d['desc'].split('.')[0]}.
- **Odor:** Odorless (typical for pharmaceutical powders)

## Safety and Hazards
- **Primary Hazard:** {d['hazard']}
- **Safety Protocols:** Requires appropriate PPE including lab coat, safety glasses, and chemical-resistant gloves. Work in well-ventilated area. Consult SDS before handling.
- **Legality:** {'Controlled substance - requires DEA registration and proper licensing' if 'Controlled' in d['hazard'] else 'Generally legal with standard laboratory restrictions. May require prescription for use.'}
- **Insurance Needs:** Standard laboratory insurance required. Additional coverage may be needed for controlled substances.

## Description
{d['desc']}

## Solubility
{d.get('solubility', 'Consult SDS for specific solubility data. Typically poorly soluble in water, soluble in organic solvents (ethanol, DMSO, DMF).')}

## Common Uses
This pharmaceutical compound is used in medical treatment. In laboratory settings, it may be used as a reference standard, for analytical method development, or for research purposes.

## Procurement
Available through chemical suppliers with proper licensing. Controlled substances require DEA registration. Research quantities available from Sigma-Aldrich, US Pharmacopeia, and specialty suppliers.

## Lab Usage
Reference standard for pharmaceutical analysis. Handle with appropriate safety precautions. Controlled substances require secure storage and proper documentation.

## Safety Protocols
- Use in fume hood
- Wear appropriate PPE
- Have spill kit available
- Know locations of safety equipment
- Follow institutional chemical hygiene plan
- For controlled substances: maintain chain of custody and proper documentation
"""
    return content

output_dir = "research/chemicals"
os.makedirs(output_dir, exist_ok=True)

for name, data in drugs.items():
    filename = f"{name.replace(' ', '_')}.md"
    content = generate_drug_md(name, data)
    with open(os.path.join(output_dir, filename), 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created {filename}")

print(f"\nTotal drug files created: {len(drugs)}")
print("Done!")