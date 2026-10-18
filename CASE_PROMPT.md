# Prompt for building a new case

How to use: open a new Claude chat, attach `data/case-01.json` and `data/lab-catalog.json`, paste everything between the lines, and fill in the CASE BRIEF.

---

You are a senior field epidemiologist and educational game designer. Build **Case N** for my "Outbreak Investigation Simulator" (a static web app). I attached `case-01.json` (the reference format and quality bar) and `lab-catalog.json` (the shared lab catalogue). Follow the same structure exactly. Output valid JSON only inside code blocks, no comments.

## CASE BRIEF (I fill this in)
- Pathogen / disease:
- Region and setting (village, town, hospital, farm...):
- Source, vector or reservoir, and route of transmission:
- Two patients (not necessarily related), who accompanies each, and their state (admitted, discharged, at home):
- Red herrings the villagers or staff believe (at least 2):
- Local beliefs and the community leader's attitude:
- Learning objectives and difficulty:

## DELIVERABLES
1. `data/case-0N.json`: the full case.
2. One new entry for `data/cases.json` with: id, title, blurb, place, level, mins, cover (`assets/images/case-0N.jpg`), fallback (`assets/images/scene-xxx.jpg`), status "open".
3. Image list: for each speaking character a file name (`assets/images/scene-name.jpg`), size 1448x1086 JPG, a text-to-image prompt (realistic documentary style, Indian setting, investigators in navy vests reading OUTBREAK SIMULATION TEAM, one clear speaker facing camera), and the speaker position as percent of the image: `pos {x,y}` at the face, plus `attPos` for an attendant. Also a 1200x675 cover image prompt.
4. A test plan: the ideal path, and 3 trap paths (rude approach, skipped evidence, wrong samples then second round).

## ENGINE RULES (the app depends on these)
- Top-level keys: case_id (case_0N), case_title, location_name, intro, start {trust, location, nodes[{id,label}]}, locations, unlock, npcs, gate, report, patients, docRules, lab.
- `start.location` is the District Health Officer (DHO) office. The final verdict is given there. The DHO NPC needs a `hyp` list. Each entry has `label` (the prefilled question, e.g. "Could it be cholera?"), `keys`, `yes` true/false, `reply`; the true one also has `needs` evidence tags, `ok`, `weak`. Add `hypNeeds` (evidence tags that must be found before these questions appear). Players cannot type: every question is a prefilled chip.
- A DHO topic must set the flag `permission` (`"set":["permission"]`). Other flags you define (for example `asha_ok`, `ward_ok`, `addr_home`) unlock NPCs or locations through `lock {flags, msg}`, and every flag needs a human message in `unlock`.
- `locations`: each may have `order` (0,1,2...), `must` [{ev, hint}] (evidence required before the player may move to a higher-order location), `lock`, and `free:true` for places reachable anytime. At least 6 musts in total. Hints must guide without giving the answer.
- NPC fields: name, role, location, portrait, scene, pos {x,y}, attPos, att (attendant name, required for patients), greetBy, hello, greet, guarded, fallback, low[] (interjections when trust < 40), voice {g:"m"|"f", p, r}, attVoice, lock, hyp (DHO only), topics[].
- Topic fields: id (unique in the whole case), style (clinical | empathy | direct), label (the chip text), keys[] (lowercase keywords and synonyms for typed questions), reply (a string, or an array of beats: a string or {text, by:"att"}), trust (+/-), needs {trust, topics[], ev[], flags[]}, ev [[tag, note]], contacts [{id, label, from, fromLabel}], set [flags], by:"att".
- Players cannot type or speak. Everything is a prefilled question (`label`) with a fixed reply. Lab results are released only after the player has met every NPC in `npcs`, so make sure every NPC can be reached.
- At least 8 topics per NPC, realistic, with hesitation, emotion and interjections by attendants. Include direct or rude options that cost trust, empathy options that earn it, and clues gated behind trust >= 45 to 50 and earlier questions. The DHO and the local leader are blunt and rude but still informative.
- Evidence tags start with `#`, CamelCase. Red herrings are `#RedHerring_X`. Every tag used in `must`, `needs.ev`, `report.required` and `gate.hints` must be granted by some topic or lab override.
- `sim` (the outbreak clock, resources and field-epi tools; every case needs it): {start {day,hour}, res {budget, ppe, fund}, cost {ask, travel, sample, order, round, wait, doctorSample, tat {PCR, ELISA, Culture, Biochemistry, Hematology} in hours}, exposureLabel (column title for the main exposure in the line list), locmap {location name: place id}, places [{id,name,x,y}] with x 0-100 and y 0-70, roads [[placeId, placeId]], linelist [{id, node (a contact-graph node id; the row appears when that node is discovered), name, age, sex, place, onset (day number; day 1 is the first day of play), sap (the main exposure: Yes/No), sym, conf (evidence tag that turns the row into Confirmed)}], schedule [{t (hours), n, place, kind, text}] (new cases that appear if the player dawdles; `kind` is what a response action can block), best (the number of cases if everything goes right), worst, fast (hours for full time marks), deadline (hours for zero time marks), cc {cases, controls, budget, hours, needs [evidence tags], vars [{id, label, t [exposed cases, unexposed cases, exposed controls, unexposed controls]}]}}. The case-control table must have a real, significant risk factor and several non-significant ones.
- `actions`: interim responses the player may order. Each {id, label, kind ("good" or "bad", never shown to the player), cost {budget, ppe, hours}, needs [evidence tags] or any [tags], blocks [schedule kinds it prevents], delay (hours until it works), trust (change), adds [{in (hours later), n, place, kind, text}] (consequences of a bad choice), say}. Include 4 good actions that need evidence and 3 tempting bad ones (a false reassurance, a pointless mass measure, a harmful drastic action).
- `events`: {count (how many random events per game, usually 3), pool [{id, from, to (hour window), title, text, options [{label, eff {trust, budget, ppe, hours, lapse, cases [{in,n,place,kind,text}], later [{in,trust,say}]}, say}]}]}. Give each event one sensible, one lazy and one reckless option.
- `patients`: exactly `[{"id":"p1",...,"npc":"patient_1","loc":"..."}, {"id":"p2",...}]`. The NPC keys are `patient_1` and `patient_2`. The tags `#Sampled_P1` and `#Sampled_P2` are logged automatically when a sample is collected.
- `docRules`: for each doctor-collected sample (csf, biopsy, aspirate) and each patient: {ok, msg}. Refuse where clinically unjustified and explain why.
- `lab`: {doctor (name of the doctor NPC), doctorLoc (the doctor's location name), confirmTag (the evidence tag logged when the key confirmatory test is positive), consentTrust (usually 45), na {sampleId: message} for sample types that cannot be collected in this case (for example a skin lesion swab), overrides}.
  - The catalogue returns a normal/negative result for every test, so only override what is special: the positive confirmatory tests (tagged with confirmTag), negative red-herring tests with a `#RedHerring_X` tag, and non-specific findings (CBC, biochemistry, CSF).
  - Override fields per test id: `txt` (replacement default text), `tag` (evidence tag), `r` (explicit per-sample results `{sampleId: [text, tag]}`), `by` (per-patient overrides `{p1: {sampleId: [text, tag]}}`), `later` (round 2 results).
  - Make positives depend on the biologically right sample (for example blood PCR negative early). Make one early serology equivocal for one patient and positive in `later`, so a second sampling round matters. Round 2 is offered only while confirmTag has not been found.
- `report`: {pathogen, reservoir, source, route (regexes tested against short typed answers), reservoirLabel, sourceLabel, routeLabel, interp (regex for the one-line lab interpretation), support [evidence tags that support the diagnosis, including ruled-out red herrings], misleading [tags that do not support it, such as a folk belief], supportTarget (supporting ticks needed for full marks, usually 6), plan [exactly 5 {label, t, all:[regex, ...]}] where label is a short heading such as "Stop the source", harm [{t, all:[...]}], required [evidence tags the player must have, include confirmTag and #Sampled_P2]}. The final verdict form is guided: a short diagnosis line, reservoir/source/route prompts, a tick-list of the player's own evidence, an automatic list of the tests they ran, and five labelled plan lines.
- `gate`: {links:3, vectorTags:[...], hints:{tag: hint}}.

## LAB CATALOGUE (shared, do not redefine; sorted alphabetically within each group)
Samples: throat (Throat swab), npswab (Nasopharyngeal swab), nasal (Nasal swab), saliva (Saliva), serum (Plain blood (serum)), edta (EDTA blood), bcult (Blood for culture (culture bottle)), citrate (Citrate blood (blue-top)), stool (Stool), rectal (Rectal swab), urine (Urine), csf (CSF (lumbar puncture), doctor), biopsy (Tissue or skin biopsy, doctor), aspirate (Tracheal aspirate / BAL, doctor), lesion (Skin lesion swab / vesicle fluid)

Tests (ids you may use in `lab.overrides`):
- chand_pcr: Chandipura Virus (CHPV) RT-PCR [vir/PCR] on: csf, serum, throat
- chik_igm: Chikungunya IgM ELISA [vir/ELISA] on: serum
- chik_pcr: Chikungunya Virus (CHIKV) RT-PCR [vir/PCR] on: serum, edta
- cchf_pcr: Crimean-Congo Hemorrhagic Fever Virus (CCHFV) RT-PCR [vir/PCR] on: serum, edta
- cmv_pcr: Cytomegalovirus (CMV) Quantitative DNA PCR [vir/PCR] on: edta, serum, urine
- dengue: Dengue NS1 antigen / IgM / IgG ELISA [vir/ELISA] on: serum
- dengue_pcr: Dengue Virus (DENV 1–4) Multiplex RT-PCR [vir/PCR] on: serum, edta
- ev_pcr: Enterovirus / EV-A71 RT-PCR [vir/PCR] on: throat, stool, csf, rectal
- ebv_pcr: Epstein-Barr Virus (EBV) Quantitative DNA PCR [vir/PCR] on: edta, serum, csf
- hav: Hepatitis A IgM [vir/ELISA] on: serum
- hav_pcr: Hepatitis A Virus (HAV) RT-PCR [vir/PCR] on: serum, stool
- hbsag: Hepatitis B surface antigen (HBsAg) [vir/ELISA] on: serum
- hbv_pcr: Hepatitis B Virus (HBV) Quantitative DNA PCR [vir/PCR] on: serum, edta
- hcv_pcr: Hepatitis C Virus (HCV) Quantitative RNA PCR & Genotyping [vir/PCR] on: serum, edta
- hev_igm: Hepatitis E IgM [vir/ELISA] on: serum
- hev_pcr: Hepatitis E Virus (HEV) RT-PCR [vir/PCR] on: serum, stool
- hsv_pcr: Herpes Simplex Virus 1 & 2 (HSV-1 / HSV-2) PCR [vir/PCR] on: csf, lesion
- hsv_ab: HSV IgM / IgG serology [vir/ELISA] on: serum
- hadv_pcr: Human Adenovirus (HAdV) PCR [vir/PCR] on: throat, npswab, nasal, stool, rectal, edta, serum
- astro_pcr: Human Astrovirus RT-PCR [vir/PCR] on: stool, rectal
- hhv6_pcr: Human Herpesvirus 6 (HHV-6) PCR [vir/PCR] on: edta, serum, csf
- hiv_pcr: Human Immunodeficiency Virus 1 & 2 (HIV-1 / HIV-2) Quantitative RNA PCR [vir/PCR] on: edta, serum
- hmpv_pcr: Human Metapneumovirus (hMPV) RT-PCR [vir/PCR] on: throat, npswab, nasal
- rv_pcr: Human Rhinovirus / Enterovirus RT-PCR [vir/PCR] on: throat, npswab, nasal, stool, csf
- htlv_pcr: Human T-Cell Lymphotropic Virus 1 & 2 (HTLV-1 / HTLV-2) PCR [vir/PCR] on: edta
- flu_pcr: Influenza A & B Multiplex RT-PCR (Subtyping: H1N1pdm09, H3N2, B Victoria) [vir/PCR] on: throat, npswab, nasal
- je: Japanese encephalitis IgM ELISA [vir/ELISA] on: serum, csf
- je_pcr: Japanese Encephalitis Virus (JEV) RT-PCR [vir/PCR] on: csf, serum
- kfd_igm: Kyasanur Forest Disease IgM ELISA [vir/ELISA] on: serum
- kfd_pcr: Kyasanur Forest Disease Virus (KFDV) RT-PCR [vir/PCR] on: serum, edta
- measles_igm: Measles IgM ELISA [vir/ELISA] on: serum
- measles_pcr: Measles Virus RT-PCR [vir/PCR] on: throat, npswab, urine
- mpox_pcr: Mpox Virus (MPXV) Clade I/II PCR [vir/PCR] on: lesion, throat, edta
- mumps_igm: Mumps IgM ELISA [vir/ELISA] on: serum
- mumps_pcr: Mumps Virus RT-PCR [vir/PCR] on: throat, saliva, csf
- nipah_elisa: Nipah IgM / IgG ELISA [vir/ELISA] on: serum, csf
- snt: Nipah serum neutralisation (BSL-4 reference lab) [vir/ELISA] on: serum, csf
- pcr: Nipah Virus (NiV) RT-PCR [vir/PCR] on: throat, npswab, nasal, saliva, urine, csf, serum, edta
- noro_pcr: Norovirus GI / GII Multiplex RT-PCR [vir/PCR] on: stool, rectal
- hpiv_pcr: Parainfluenza Viruses 1–4 (HPIV 1–4) RT-PCR [vir/PCR] on: throat, npswab, nasal
- b19_pcr: Parvovirus B19 DNA PCR [vir/PCR] on: serum, edta
- rabies_ab: Rabies antibody (ELISA / RFFIT) [vir/ELISA] on: serum
- rabies_pcr: Rabies Virus RT-PCR [vir/PCR] on: saliva, biopsy
- rsv_pcr: Respiratory Syncytial Virus (RSV A/B) RT-PCR [vir/PCR] on: throat, npswab, nasal, saliva
- rota_pcr: Rotavirus A RT-PCR [vir/PCR] on: stool, rectal
- rubella_pcr: Rubella Virus RT-PCR [vir/PCR] on: throat, npswab, urine
- sapo_pcr: Sapovirus RT-PCR [vir/PCR] on: stool, rectal
- covid_pcr: SARS-CoV-2 RT-PCR (Gene targets: N, E, RdRp) [vir/PCR] on: throat, npswab, nasal, saliva
- vzv_pcr: Varicella Zoster Virus (VZV) PCR [vir/PCR] on: csf, serum, lesion
- isolation: Virus isolation in cell culture (BSL-4 only) [vir/Culture] on: throat, urine, csf
- zika_igm: Zika IgM ELISA [vir/ELISA] on: serum
- zika_pcr: Zika Virus (ZIKV) RT-PCR [vir/PCR] on: serum, urine
- tb: AFB smear / TB GeneXpert (CSF) [micro/Culture] on: csf
- blood_cult: Blood culture [micro/Culture] on: bcult
- brucella: Brucella serology (Rose Bengal / tube agglutination) [micro/ELISA] on: serum
- crag: Cryptococcal antigen / India ink [micro/ELISA] on: csf, serum
- csf_cult: CSF bacterial culture [micro/Culture] on: csf
- csf_gram: CSF Gram stain [micro/Culture] on: csf
- fungal: Fungal culture (CSF) [micro/Culture] on: csf
- lepto: Leptospira IgM ELISA [micro/ELISA] on: serum
- scrub: Scrub typhus IgM ELISA [micro/ELISA] on: serum
- stool_cult: Stool culture (Salmonella / Shigella) [micro/Culture] on: stool, rectal
- cholera: Stool culture for Vibrio cholerae [micro/Culture] on: stool, rectal
- throat_cult: Throat swab culture [micro/Culture] on: throat
- typhidot: Typhoid IgM (Typhidot) [micro/ELISA] on: serum
- urine_cult: Urine culture and sensitivity [micro/Culture] on: urine
- weil: Weil-Felix test (rickettsial) [micro/ELISA] on: serum
- widal: Widal test [micro/ELISA] on: serum
- crp: C-reactive protein (CRP) [path/Biochemistry] on: serum
- coag: Coagulation profile (PT/INR, aPTT) [path/Hematology] on: citrate
- cbc: Complete blood count [path/Hematology] on: edta
- csfchem: CSF cytology and biochemistry [path/Biochemistry] on: csf
- esr: ESR [path/Hematology] on: edta
- malaria: Malaria RDT / smear [path/Hematology] on: edta
- smear: Peripheral blood smear [path/Hematology] on: edta
- pct: Procalcitonin [path/Biochemistry] on: serum
- glucose: Random blood glucose [path/Biochemistry] on: serum
- bioc: Serum biochemistry (LFT, RFT, electrolytes) [path/Biochemistry] on: serum
- stoolrm: Stool routine and microscopy [path/Biochemistry] on: stool
- urinerm: Urine routine and microscopy [path/Biochemistry] on: urine

If the case needs a test that is missing, tell me the new catalogue entry (id, name, cat, kind, on, txt) separately.

## QUALITY CHECKS BEFORE YOU ANSWER
- JSON is valid. Every `needs.topics` id exists. Every location `must` tag is reachable before the player must leave. No deadlocks if trust stays above 50.
- The pathogen is never named outright by NPCs; players infer it.
- Conversations are realistic regional speech, not textbook language.
