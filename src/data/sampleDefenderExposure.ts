import type { DefenderExposureExport } from "../types.js";

export const sampleDefenderExposurePayload: DefenderExposureExport = {
  controls: [
    {
      id: "ctrl-tenant-core",
      tenantId: "tenant-kg-prod",
      scope: "Global tenant",
      status: "HEALTHY",
      plans: ["ATTACK_PATH", "DEVICE", "IDENTITY", "VULNERABILITY"],
      owner: "Exposure Operations",
      automatedRemediation: true
    },
    {
      id: "ctrl-collab-eu",
      tenantId: "tenant-kg-emea",
      scope: "EMEA collaboration tenant",
      status: "DEGRADED",
      plans: ["IDENTITY", "EMAIL"],
      owner: "Collaboration Security",
      automatedRemediation: false
    }
  ],
  recommendations: [
    {
      id: "md-001",
      category: "Attack paths",
      title: "Attack path from unmanaged admin workstation to privileged cloud app remains open",
      scope: "Global tenant",
      severity: "high",
      status: "ACTIVE",
      assetType: "Device",
      asset: "WIN-ADMIN-22",
      source: "ATTACK_PATH",
      createdAt: "2026-05-26T09:10:00Z",
      updatedAt: "2026-05-26T10:35:00Z",
      owner: "Exposure Operations",
      note: "Break the path before the next change window."
    },
    {
      id: "md-002",
      category: "Identity",
      title: "Privileged break-glass account lacks current risk review",
      scope: "Global tenant",
      severity: "high",
      status: "ACTIVE",
      assetType: "Identity",
      asset: "svc-breakglass-01",
      principal: "svc-breakglass-01@kineticgain.com",
      source: "IDENTITY",
      createdAt: "2026-05-25T20:15:00Z",
      updatedAt: "2026-05-25T21:00:00Z",
      owner: "Identity Operations",
      note: "Validate sign-in guardrails and remove excess standing access."
    },
    {
      id: "md-003",
      category: "Device",
      title: "Server exposure after EDR drift on finance reporting node",
      scope: "Finance workloads",
      severity: "medium",
      status: "ACTIVE",
      assetType: "Server",
      asset: "srv-fin-reports-03",
      source: "DEVICE",
      createdAt: "2026-05-24T22:00:00Z",
      updatedAt: "2026-05-24T22:40:00Z",
      owner: "Endpoint Engineering",
      note: "Restore Defender coverage and verify the service account path."
    },
    {
      id: "md-004",
      category: "Collaboration",
      title: "Mailbox forwarding and phishing-safe-link policy proof is incomplete",
      scope: "EMEA collaboration tenant",
      severity: "medium",
      status: "ACTIVE",
      assetType: "Mailbox",
      asset: "finance-emea@kineticgain.com",
      source: "EMAIL",
      createdAt: "2026-05-24T08:30:00Z",
      updatedAt: "2026-05-24T09:15:00Z",
      owner: "Collaboration Security",
      note: "Resolve mail-flow rule and anti-phish posture before external campaigns resume."
    },
    {
      id: "md-005",
      category: "Vulnerability",
      title: "Critical browser vulnerability remains active on executive laptop",
      scope: "Executive fleet",
      severity: "high",
      status: "ACTIVE",
      assetType: "Device",
      asset: "LAP-EXEC-07",
      source: "VULNERABILITY",
      createdAt: "2026-05-23T12:00:00Z",
      updatedAt: "2026-05-23T12:20:00Z",
      note: "Patch status still not verified in the remediation queue."
    },
    {
      id: "md-006",
      category: "Identity",
      title: "Legacy guest account spike reviewed and closed",
      scope: "EMEA collaboration tenant",
      severity: "low",
      status: "RESOLVED",
      assetType: "Identity",
      asset: "guest-partner-legacy",
      principal: "guest-partner-legacy#EXT#@kineticgain.onmicrosoft.com",
      source: "IDENTITY",
      createdAt: "2026-05-20T12:00:00Z",
      updatedAt: "2026-05-21T08:00:00Z",
      owner: "Identity Operations"
    }
  ]
};

export const exposureLanePackets = [
  {
    id: "attack-path-lane",
    lane: "Attack path lane",
    owner: "Exposure Operations",
    focus: "Chained-risk paths across devices, identities, and cloud apps.",
    status: "red",
    note: "An active attack path remains open across admin workstation and cloud app trust.",
    nextAction: "Break the chained path before the next privileged change window."
  },
  {
    id: "identity-lane",
    lane: "Privileged identity lane",
    owner: "Identity Operations",
    focus: "Standing access, break-glass risk, and privileged review hygiene.",
    status: "red",
    note: "Privileged identities still carry unresolved Defender recommendations.",
    nextAction: "Re-validate break-glass access and close excess standing permission paths."
  },
  {
    id: "device-lane",
    lane: "Device resilience lane",
    owner: "Endpoint Engineering",
    focus: "Server exposure, EDR drift, and remediation packet completeness.",
    status: "yellow",
    note: "Device exposure is containable, but remediation proof is not complete yet.",
    nextAction: "Restore Defender telemetry and reconcile remediation status for finance nodes."
  },
  {
    id: "collab-lane",
    lane: "Collaboration posture lane",
    owner: "Collaboration Security",
    focus: "Mailbox exposure, anti-phish coverage, and forwarding-risk controls.",
    status: "red",
    note: "Email posture and collaboration proof are still degraded in the EMEA tenant.",
    nextAction: "Repair collaboration protection evidence before external workflows expand."
  }
];

export const remediationPackets = [
  {
    packetId: "DF-11",
    lane: "Attack path break packet",
    owner: "Exposure Operations",
    completenessScore: 64,
    status: "red",
    blocker: "Privileged cloud-app ownership is not fully reconciled against the workstation risk.",
    launchWindowHours: 6,
    decisionNote: "Do not wait for the weekly admin review before closing the attack path."
  },
  {
    packetId: "DF-18",
    lane: "Break-glass review packet",
    owner: "Identity Operations",
    completenessScore: 79,
    status: "yellow",
    blocker: "Identity review evidence is drafted but not yet approved for removal of excess standing access.",
    launchWindowHours: 10,
    decisionNote: "Approval can clear once the latest sign-in and ownership proof land."
  },
  {
    packetId: "DF-24",
    lane: "Finance server remediation packet",
    owner: "Endpoint Engineering",
    completenessScore: 58,
    status: "red",
    blocker: "Server coverage is restored only partially and patch attestation is still incomplete.",
    launchWindowHours: 8,
    decisionNote: "Hold the reporting wave until server exposure is fully contained."
  },
  {
    packetId: "DF-31",
    lane: "Collaboration control packet",
    owner: "Collaboration Security",
    completenessScore: 72,
    status: "red",
    blocker: "Mailbox forwarding proof and anti-phish control evidence are still not reconciled.",
    launchWindowHours: 4,
    decisionNote: "Resolve collaboration posture before the next external campaign launch."
  }
];
