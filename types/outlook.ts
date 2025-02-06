export type OutlookWithRelations = {
  outlook: string;
  id: number;
  noc: string;
  economicRegionCode: string;
  title: string;
  trends: string;
  releaseDate: Date;
  province: string;
  lang: string;
  programNid: number | null;
  economicRegion: { economicRegionName: string; };
  unitGroup: { occupation: string; };
};
