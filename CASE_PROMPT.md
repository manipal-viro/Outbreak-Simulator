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
- `patients`: exactly `[{"id":"p1",...,"npc":"patient_1","loc":"..."}, {"id":"p2",...}]`. The NPC keys are `patient_1` and `patient_2`. The tags `#Sampled_P1` and `#Sampled_P2` are logged automatically when a sample is collected.
- `docRules`: for each doctor-collected sample (csf, biopsy, aspirate) and each patient: {ok, msg}. Refuse where clinically unjustified and explain why.
- `lab`: {doctor (name of the doctor NPC), doctorLoc (the doctor's location name), confirmTag (the evidence tag logged when the key confirmatory test is positive), consentTrust (usually 45), overrides}.
  - The catalogue returns a normal/negative result for every test, so only override what is special: the positive confirmatory tests (tagged with confirmTag), negative red-herring tests with a `#RedHerring_X` tag, and non-specific findings (CBC, biochemistry, CSF).
  - Override fields per test id: `txt` (replacement default text), `tag` (evidence tag), `r` (explicit per-sample results `{sampleId: [text, tag]}`), `by` (per-patient overrides `{p1: {sampleId: [text, tag]}}`), `later` (round 2 results).
  - Make positives depend on the biologically right sample (for example blood PCR negative early). Make one early serology equivocal for one patient and positive in `later`, so a second sampling round matters. Round 2 is offered only while confirmTag has not been found.
- `report`: {pathogen, reservoir, source, route (regexes tested against short typed answers), reservoirLabel, sourceLabel, routeLabel, interp (regex for the one-line lab interpretation), support [evidence tags that support the diagnosis, including ruled-out red herrings], misleading [tags that do not support it, such as a folk belief], supportTarget (supporting ticks needed for full marks, usually 6), plan [exactly 5 {label, t, all:[regex, ...]}] where label is a short heading such as "Stop the source", harm [{t, all:[...]}], required [evidence tags the player must have, include confirmTag and #Sampled_P2]}. The final verdict form is guided: a short diagnosis line, reservoir/source/route prompts, a tick-list of the player's own evidence, an automatic list of the tests they ran, and five labelled plan lines.
- `gate`: {links:3, vectorTags:[...], hints:{tag: hint}}.

## LAB CATALOGUE (shared, do not redefine)
Samples: throat (Throat swab), npswab (Nasopharyngeal swab), nasal (Nasal swab), saliva (Saliva), serum (Plain blood (serum)), edta (EDTA blood), bcult (Blood for culture (culture bottle)), citrate (Citrate blood (blue-top)), stool (Stool), rectal (Rectal swab), urine (Urine), csf (CSF (lumbar puncture), doctor), biopsy (Tissue or skin biopsy, doctor), aspirate (Tracheal aspirate / BAL, doctor)

Tests (ids you may use in `lab.overrides`):
- pcr: Nipah virus RT-PCR [vir/PCR] on: throat, npswab, nasal, saliva, urine, csf, serum, edta
- je_pcr: Japanese encephalitis RT-PCR [vir/PCR] on: csf, serum
- dengue_pcr: Dengue RT-PCR (serotyping) [vir/PCR] on: serum, edta
- chik_pcr: Chikungunya RT-PCR [vir/PCR] on: serum, edta
- zika_pcr: Zika virus RT-PCR [vir/PCR] on: serum, urine
- kfd_pcr: Kyasanur Forest Disease RT-PCR [vir/PCR] on: serum, edta
- chand_pcr: Chandipura virus RT-PCR [vir/PCR] on: csf, serum, throat
- rabies_pcr: Rabies RT-PCR (saliva / skin biopsy) [vir/PCR] on: saliva, biopsy
- ev_pcr: Enterovirus / EV-A71 RT-PCR [vir/PCR] on: throat, stool, csf, rectal
- hsv_pcr: HSV-1/2 PCR [vir/PCR] on: csf
- vzv_pcr: Varicella zoster virus PCR [vir/PCR] on: csf, serum
- cmv_pcr: CMV DNA PCR [vir/PCR] on: edta, serum, urine
- flu_pcr: Influenza A/B RT-PCR [vir/PCR] on: throat, npswab, nasal
- covid_pcr: SARS-CoV-2 RT-PCR [vir/PCR] on: throat, npswab, nasal, saliva
- measles_pcr: Measles RT-PCR [vir/PCR] on: throat, npswab, urine
- mumps_pcr: Mumps RT-PCR [vir/PCR] on: throat, saliva, csf
- hev_pcr: Hepatitis E RNA PCR [vir/PCR] on: serum, stool
- nipah_elisa: Nipah IgM / IgG ELISA [vir/ELISA] on: serum, csf
- je: Japanese encephalitis IgM ELISA [vir/ELISA] on: serum, csf
- dengue: Dengue NS1 antigen / IgM / IgG ELISA [vir/ELISA] on: serum
- chik_igm: Chikungunya IgM ELISA [vir/ELISA] on: serum
- zika_igm: Zika IgM ELISA [vir/ELISA] on: serum
- kfd_igm: Kyasanur Forest Disease IgM ELISA [vir/ELISA] on: serum
- hsv_ab: HSV IgM / IgG serology [vir/ELISA] on: serum
- measles_igm: Measles IgM ELISA [vir/ELISA] on: serum
- mumps_igm: Mumps IgM ELISA [vir/ELISA] on: serum
- rabies_ab: Rabies antibody (ELISA / RFFIT) [vir/ELISA] on: serum
- hav: Hepatitis A IgM [vir/ELISA] on: serum
- hbsag: Hepatitis B surface antigen (HBsAg) [vir/ELISA] on: serum
- hev_igm: Hepatitis E IgM [vir/ELISA] on: serum
- snt: Nipah serum neutralisation (BSL-4 reference lab) [vir/ELISA] on: serum, csf
- isolation: Virus isolation in cell culture (BSL-4 only) [vir/Culture] on: throat, urine, csf
- blood_cult: Blood culture [micro/Culture] on: bcult
- csf_gram: CSF Gram stain [micro/Culture] on: csf
- csf_cult: CSF bacterial culture [micro/Culture] on: csf
- urine_cult: Urine culture and sensitivity [micro/Culture] on: urine
- stool_cult: Stool culture (Salmonella / Shigella) [micro/Culture] on: stool, rectal
- cholera: Stool culture for Vibrio cholerae [micro/Culture] on: stool, rectal
- throat_cult: Throat swab culture [micro/Culture] on: throat
- fungal: Fungal culture (CSF) [micro/Culture] on: csf
- tb: AFB smear / TB GeneXpert (CSF) [micro/Culture] on: csf
- crag: Cryptococcal antigen / India ink [micro/ELISA] on: csf, serum
- widal: Widal test [micro/ELISA] on: serum
- typhidot: Typhoid IgM (Typhidot) [micro/ELISA] on: serum
- scrub: Scrub typhus IgM ELISA [micro/ELISA] on: serum
- lepto: Leptospira IgM ELISA [micro/ELISA] on: serum
- brucella: Brucella serology (Rose Bengal / tube agglutination) [micro/ELISA] on: serum
- weil: Weil-Felix test (rickettsial) [micro/ELISA] on: serum
- bioc: Serum biochemistry (LFT, RFT, electrolytes) [path/Biochemistry] on: serum
- glucose: Random blood glucose [path/Biochemistry] on: serum
- crp: C-reactive protein (CRP) [path/Biochemistry] on: serum
- pct: Procalcitonin [path/Biochemistry] on: serum
- cbc: Complete blood count [path/Hematology] on: edta
- smear: Peripheral blood smear [path/Hematology] on: edta
- malaria: Malaria RDT / smear [path/Hematology] on: edta
- esr: ESR [path/Hematology] on: edta
- coag: Coagulation profile (PT/INR, aPTT) [path/Hematology] on: citrate
- csfchem: CSF cytology and biochemistry [path/Biochemistry] on: csf
- urinerm: Urine routine and microscopy [path/Biochemistry] on: urine
- stoolrm: Stool routine and microscopy [path/Biochemistry] on: stool

If the case needs a test that is missing, tell me the new catalogue entry (id, name, cat, kind, on, txt) separately.

## QUALITY CHECKS BEFORE YOU ANSWER
- JSON is valid. Every `needs.topics` id exists. Every location `must` tag is reachable before the player must leave. No deadlocks if trust stays above 50.
- The pathogen is never named outright by NPCs; players infer it.
- Conversations are realistic regional speech, not textbook language.
