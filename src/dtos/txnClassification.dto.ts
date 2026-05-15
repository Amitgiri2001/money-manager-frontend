export type TxnClassificationLevel = "TYPE" | "CATEGORY";

export interface TxnClassificationDto {
  id: number;
  level: TxnClassificationLevel;
  name: string;
  description: string;
  createdBy: number | null;
  parentId?: number | null;
  createAt: string;
  updatedAt: string;
}

export interface TxnClassificationRequestDto {
  level: TxnClassificationLevel;
  name: string;
  description: string;
  createdBy: number;
  parentId?: number | null;
}
