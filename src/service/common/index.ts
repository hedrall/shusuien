import { _FilterService } from 'src/service/common/filter';
import { _IFilterService } from 'src/service/common/filter/interface';
import { _鉢Service } from 'src/service/common/鉢';
import { _I鉢Service } from 'src/service/common/鉢/interface';

export const _Common: _ICommon = {
  Filter: _FilterService,
  鉢: _鉢Service,
};
export type _ICommon = {
  鉢: _I鉢Service;
  Filter: _IFilterService;
};
