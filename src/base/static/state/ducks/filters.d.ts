export type FiltersConfig = {
  enabled: boolean;
  components: [];
};
export const loadFiltersConfig: (filtersConfig: FiltersConfig) => void;
export const filtersConfigSelector: any;