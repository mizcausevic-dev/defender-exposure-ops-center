// Operator surface for Microsoft Defender exposure operations.
//
// Inputs reflect synthetic exports or captured snapshots for:
//   - control and plan coverage
//   - exposure recommendations across attack paths, identities, devices, and SaaS posture

export type ControlStatus = "HEALTHY" | "DEGRADED";
export type RecommendationStatus = "ACTIVE" | "RESOLVED";
export type RecommendationSeverity = "high" | "medium" | "low" | "info";
export type AssetType = "Device" | "Identity" | "Mailbox" | "CloudApp" | "Server" | "Tenant" | string;
export type ExposureSource = "ATTACK_PATH" | "DEVICE" | "IDENTITY" | "EMAIL" | "VULNERABILITY" | string;

export interface ExposureControl {
  id: string;
  tenantId: string;
  scope: string;
  status: ControlStatus;
  plans: ExposureSource[];
  owner: string;
  automatedRemediation: boolean;
}

export interface ExposureRecommendation {
  id: string;
  category: string;
  title: string;
  scope: string;
  severity: RecommendationSeverity;
  status: RecommendationStatus;
  assetType: AssetType;
  asset: string;
  principal?: string;
  source?: ExposureSource;
  createdAt: string;
  updatedAt?: string;
  owner?: string;
  note?: string;
}

export interface DefenderExposureExport {
  controls?: ExposureControl[];
  recommendations?: ExposureRecommendation[];
}

export type RecommendationCode =
  | "no-healthy-control"
  | "control-plan-missing"
  | "attack-path-open"
  | "privileged-identity-exposed"
  | "device-risk-uncontained"
  | "email-posture-gap"
  | "critical-vulnerability-open"
  | "high-severity-unassigned"
  | "stale-active-recommendation";

export interface Finding {
  code: RecommendationCode;
  severity: RecommendationSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: string;
  principal?: string;
  owner?: string;
}

export interface ExposureReport {
  generatedAt: string;
  controls: number;
  healthyControls: number;
  recommendations: number;
  recommendationsByStatus: Record<RecommendationStatus, number>;
  highSeverityRecommendations: number;
  attackPathSignals: number;
  staleRecommendations: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface ExposureOptions {
  now?: string;
  staleRecommendationAfterHours?: number;
}
