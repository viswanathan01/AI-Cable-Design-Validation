# Sample Test Cases for Cable Design Validation

## 1. Valid LV Cable (PASS)
**Scenario**: Standard IEC 60502-1 PVC Cable.
**Input (Free Text)**:
```
3x185+95 mm2 Cu/XLPE/PVC/SWA/PVC 0.6/1kV IEC 60502-1
```
**Expected Output**:
- Status: PASS
- Voltage: 0.6/1 kV
- Conductor: Copper, Class 2 (assumed)
- Insulation: XLPE

## 2. Borderline Thickness (WARN)
**Scenario**: Insulation thickness matches minimum but user didn't specify standard.
**Input (Structured)**:
```json
{
  "conductor": "Copper",
  "csa": "10 mm2",
  "insulation_material": "PVC",
  "insulation_thickness": "1.0 mm",
  "voltage": "0.6/1 kV"
}
```
**Expected Output**:
- Status: WARN (Validation of thickness might depend on specific table lookups which AI might flag as "Confirm standard usage")
- AI should infer IEC 60502-1.

## 3. Invalid Design (FAIL)
**Scenario**: High voltage on low voltage insulation.
**Input (Free Text)**:
```
11kV cable with 1.0mm PVC insulation
```
**Expected Output**:
- Status: FAIL
- Reason: 1.0mm PVC is totally insufficient for 11kV (requires much thicker XLPE or similar).

## 4. Ambiguous Input (WARN)
**Scenario**: Missing key details.
**Input (Free Text)**:
```
Power cable for motor
```
**Expected Output**:
- Status: WARN
- Comment: "Insufficient data to validate. Assuming LV..."
