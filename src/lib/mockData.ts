// Static demo data — displayed in the dashboard UI.
// These never touch the auth/session/note store.

export interface MockPatient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  condition: string;
  visits: number;
  initials: string;
  avatarColor: string; // Tailwind bg class
  lastVisit: string;
}

export interface MockNote {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  content: string;
  isAiGenerated: boolean;
  createdAt: string; // ISO string (static)
  soap?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "demo-p1",
    firstName: "John",
    lastName: "Doe",
    age: 45,
    condition: "Lumbar Pain",
    visits: 8,
    initials: "JD",
    avatarColor: "bg-blue-500",
    lastVisit: "Mar 20, 2026",
  },
  {
    id: "demo-p2",
    firstName: "Jane",
    lastName: "Smith",
    age: 38,
    condition: "Cervical Strain",
    visits: 3,
    initials: "JS",
    avatarColor: "bg-purple-500",
    lastVisit: "Mar 21, 2026",
  },
  {
    id: "demo-p3",
    firstName: "Robert",
    lastName: "Johnson",
    age: 62,
    condition: "Shoulder Impingement",
    visits: 12,
    initials: "RJ",
    avatarColor: "bg-amber-500",
    lastVisit: "Mar 19, 2026",
  },
  {
    id: "demo-p4",
    firstName: "Maria",
    lastName: "Garcia",
    age: 29,
    condition: "Sports Injury",
    visits: 2,
    initials: "MG",
    avatarColor: "bg-rose-500",
    lastVisit: "Mar 22, 2026",
  },
  {
    id: "demo-p5",
    firstName: "David",
    lastName: "Kim",
    age: 51,
    condition: "Sciatica",
    visits: 6,
    initials: "DK",
    avatarColor: "bg-teal-500",
    lastVisit: "Mar 18, 2026",
  },
];

export const MOCK_SOAP_TEMPLATES: Record<string, {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}> = {
  "demo-p1": {
    subjective:
      "Patient John Doe, 45M presents for follow-up of acute lumbar pain. Rates pain 5/10 today, improved from 8/10 last visit. Aggravated by prolonged sitting and forward flexion. No radiating symptoms. Sleeping better with positional modifications.",
    objective:
      "Lumbar ROM: Flexion 65° (improved from 40°), Extension 20°. Paraspinal muscle tension decreased bilaterally L3-L5. SLR negative bilaterally. Neurological exam intact. Deep tendon reflexes 2+ bilaterally.",
    assessment:
      "Lumbar strain/sprain, improving. ICD-10: M54.5. Patient responding well to conservative chiropractic management. No signs of radiculopathy at this time.",
    plan:
      "Continue chiropractic manipulation L3-S1 2×/week. Progress to home exercise program: lumbar stabilization, McKenzie extension exercises. Ice 15 min BID. Limit prolonged sitting >30 min. Re-evaluate in 3 weeks.",
  },
  "demo-p2": {
    subjective:
      "Jane Smith, 38F presents with cervicogenic headache. Onset 6 weeks post-MVA. Headache 4/10 currently, mostly right occipital radiation to temporal area. Screen time aggravates. Denies visual changes or nausea.",
    objective:
      "Cervical ROM: Flexion 42°, Right rotation 50° (restricted). Right suboccipital hypertonicity. C1-C2 restriction noted on palpation. Cranial nerve screen intact. Upper extremity strength/sensation WNL.",
    assessment:
      "Cervicogenic headache, post-traumatic. Cervical facet syndrome C1-C2. ICD-10: M53.0. Improved from initial presentation but ongoing restriction at upper cervical segments.",
    plan:
      "Chiropractic manipulation C1-C2, upper thoracic. IASTM suboccipital region. Postural re-education, ergonomic review of workstation. Reduce screen time or take breaks Q30 min. Re-evaluate 2 weeks.",
  },
  "demo-p3": {
    subjective:
      "Robert Johnson, 62M reports persistent right shoulder pain ×8 weeks. Overhead activities extremely limited. Pain 6/10 at rest, 9/10 with arm elevation. Occupation: retired carpenter. Recent increase in yard work.",
    objective:
      "Right shoulder: Abduction limited to 100° (pain arc 70-120°). Neer sign +, Hawkins-Kennedy +, Empty can +. Infraspinatus strength 3+/5. AC joint tenderness. No instability. Left shoulder WNL for comparison.",
    assessment:
      "Right shoulder impingement syndrome with likely supraspinatus tendinopathy. ICD-10: M75.1. Moderate functional limitation. Recommend diagnostic ultrasound.",
    plan:
      "Chiropractic adjustment GH and AC joints. IASTM rotator cuff. Therapeutic exercise: scapular stabilization, band rotation. Modify activities — avoid overhead ×6 weeks. Ultrasound referral. NSAIDs PRN. Follow-up 4 weeks.",
  },
  "demo-p4": {
    subjective:
      "Maria Garcia, 29F presents with left ankle sprain sustained during soccer 5 days ago. Pain 7/10 with weight bearing. Swelling and bruising lateral ankle. No pop heard. Unable to play since injury.",
    objective:
      "Left ankle: Moderate edema lateral aspect. Ecchymosis over ATFL region. ATFL tender to palpation, CFL minimally tender. Anterior drawer test +1 (mild laxity vs. right). Dorsiflexion limited by pain. Ottawa negative for fracture.",
    assessment:
      "Grade II lateral ankle sprain, left. ATFL partial tear suspected. ICD-10: S93.401A. No fracture on clinical assessment. Good candidate for conservative management.",
    plan:
      "RICE protocol continue. Chiropractic mobilization ankle/foot. Taping — functional bracing. Progressive WB as tolerated. Proprioceptive rehab phase 1. Avoid return to sport ×3 weeks minimum. Re-evaluate weekly.",
  },
  "demo-p5": {
    subjective:
      "David Kim, 51M presents with right-sided sciatica. Buttock pain radiating down posterior thigh to calf, rated 6/10. Started 3 months ago insidiously. Worsens with prolonged sitting. Works as accountant (desk job).",
    objective:
      "SLR positive right at 45° (reproduces radicular sx). Paraspinal tension L4-S1 right. Piriformis tightness right. L4 dermatomal hypesthesia right lateral leg. DTR patella 2+, Achilles 1+ right (vs 2+ left).",
    assessment:
      "Right sciatica, likely L4-L5 disc involvement. ICD-10: M54.42. Piriformis syndrome contributing. Recommend MRI lumbar spine to rule out significant disc herniation.",
    plan:
      "Chiropractic manipulation L4-L5, SI joint. Piriformis and hip flexor release. Cox flexion-distraction technique. MRI referral. Ergonomic assessment workstation. Walking program 20 min daily. Re-evaluate 2 weeks.",
  },
};

export const MOCK_NOTES: MockNote[] = [
  {
    id: "demo-n1",
    patientId: "demo-p1",
    patientName: "John Doe",
    title: "Lumbar Pain — Follow-up #8",
    content:
      "Patient reports significant improvement. Lumbar ROM normalising. Continuing manipulation protocol L3-S1.",
    isAiGenerated: false,
    createdAt: "2026-03-20T10:30:00Z",
  },
  {
    id: "demo-n2",
    patientId: "demo-p2",
    patientName: "Jane Smith",
    title: "Cervicogenic Headache — Visit #3",
    content:
      "AI-generated SOAP note. C1-C2 restriction addressed. Headache frequency reduced from daily to 2-3×/week.",
    isAiGenerated: true,
    createdAt: "2026-03-21T09:15:00Z",
  },
  {
    id: "demo-n3",
    patientId: "demo-p3",
    patientName: "Robert Johnson",
    title: "Shoulder Impingement — Initial Eval",
    content:
      "Comprehensive shoulder examination. Positive impingement signs. Referral for diagnostic ultrasound placed.",
    isAiGenerated: true,
    createdAt: "2026-03-19T14:00:00Z",
  },
  {
    id: "demo-n4",
    patientId: "demo-p4",
    patientName: "Maria Garcia",
    title: "Ankle Sprain — Acute Visit",
    content:
      "Grade II lateral ankle sprain. ATFL involvement. Initiated RICE and functional bracing protocol.",
    isAiGenerated: false,
    createdAt: "2026-03-22T08:45:00Z",
  },
  {
    id: "demo-n5",
    patientId: "demo-p5",
    patientName: "David Kim",
    title: "Sciatica — Progress Note #6",
    content:
      "Right-sided sciatica improving with Cox technique. SLR now positive at 60° (was 45°). MRI ordered.",
    isAiGenerated: true,
    createdAt: "2026-03-18T11:00:00Z",
  },
  {
    id: "demo-n6",
    patientId: "demo-p1",
    patientName: "John Doe",
    title: "Lumbar Pain — Initial Presentation",
    content:
      "New patient. Acute lumbar strain post-lifting injury. Paraspinal spasm L3-L5. X-ray: no fracture. Initiated care.",
    isAiGenerated: false,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "demo-n7",
    patientId: "demo-p2",
    patientName: "Jane Smith",
    title: "Post-MVA Assessment",
    content:
      "Whiplash mechanism. Cervical ROM restricted in all planes. No neurological deficits. Initiated conservative care.",
    isAiGenerated: false,
    createdAt: "2026-03-05T13:30:00Z",
  },
  {
    id: "demo-n8",
    patientId: "demo-p5",
    patientName: "David Kim",
    title: "Sciatica — Initial Evaluation",
    content:
      "Chronic sciatica 3 months duration. L4-L5 level suspected. Piriformis involvement. Full evaluation completed.",
    isAiGenerated: true,
    createdAt: "2026-02-28T09:00:00Z",
  },
];
