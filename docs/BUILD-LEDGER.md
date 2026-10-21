# Build ledger

2026-10-21: User approved creating the reviewed GitHub kit. Native execution selected by assistant to continue authorized work without another handoff. A new isolated repository is appropriate: no existing kit repository/worktree exists.
Ruling: current instruction authorizes repository creation/push/release; private visibility follows the reviewed design. No additional approval checkpoint is needed for the already-authorized publication.
Ruling: automated technical checks cannot replace the learner's independent practice; release will label that check as remaining.

Task 1: unit tests RED (5 failures) then GREEN (5 passes); dependency lock installed. Task 2: guard RED then GREEN; real MySQL server 9.7.1 initialized only dedicated marked practice DB.
Task 3: API suite RED against 501 stub. Ruling: detail DTO has 13 named fields (the exact allowlist), not 14; corrected mistaken count assertion. FK case uses a unique SKU so it does not accidentally test duplicate precedence.

Task 3 complete: full suite 16/16 against actual MySQL. Task 4: Thai setup/contract/CRUD/pagination/error/key/template/offline guides and request samples. Worked-example test RED missing module → GREEN real MySQL books string-PK CRUD with changed envelope/DTO/base path. Docs link/reproducibility check added.

Task 4 docs check RED exposed HTML self-link incorrectly targeting absent chapter; fixed to README chapter. Suite GREEN18/18. Task 5 template verification: original teacher ZIP extracted to temp, unchanged package retained, documented sources copied, shared API contract suite GREEN8/8 on MySQL. No exam files altered.
Ruling: use macOS sandbox-exec child-process policy denying external outbound connections while allowing localhost; this verifies offline API/dependencies without changing machine network settings. It does not replace learner testing with Wi-Fi disconnected.

Task 5 complete: source ZIP unpacked to temp, local prepared modules linked, OS sandbox denied direct external TCP; 21/21 tests passed with real local MySQL. First offline run RED exposed Node does not treat tests/ as a test-file glob; changed to explicit discovered test files and GREEN21/21. Postman GUI remains untested and labeled.

Final review: fresh read-only reviewer kit_final_review at 0f3d6dd. No critical issues. Important: concurrent first initialization. Reproduction on new int161_practice_concurrent_20261021 returned 1 success and 5 ER_DB_CREATE_EXISTS failures. Fixed test entry points to serialize files; initializer itself intentionally remains a single-run setup utility, not a concurrent provisioning service.
Final: Ruling: re-grade quick-start doctor-before-init from minor to important for this beginner-facing kit — the documented first setup reports an avoidable failure before the user has a working app; reorder initialization before diagnostics — cost if wrong: only the order of two setup commands changes. Documentation-only correction needs no implementation-mirroring test.
Final: Ruling: independent learner practice, Postman GUI, Windows/other MySQL versions, production authentication/concurrent writers, re-packaging a source ZIP without Git, and unknown future exam contracts are outside verified claims — each is explicitly limited in the docs rather than silently treated as passed — cost if misunderstood: user must prepare and rehearse on the actual exam machine and adapt to the real spec.
Final review deferred minors: none after setup-order reclassification.

Final: fixed first-run test initialization race — concurrent setup reproduction RED (ER_DB_CREATE_EXISTS), serialized npm test on absent int161_practice_release_fresh_20261021 GREEN21/21; packaged offline run on absent int161_practice_release_offline_20261021 GREEN21/21; migrated template GREEN8/8. Actual server.js entry also HTTP200.
Publication: private GitHub repo created and main pushed at https://github.com/Phakinza007/int161-exam-kit. Finishing skill integration menu superseded by the user's explicit create-GitHub request; no extra approval needed, no shared existing branch modified. Release v1.0.0 source ZIP and checksum prepared from the final committed tree.
