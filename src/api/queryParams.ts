import type { PageRequestDto } from '../dtos/api';
import type { TxnFilterDto } from '../dtos/txn.dto';

export function buildPageParams(pageRequest: PageRequestDto) {
  const params: Record<string, string | number> = {
    page: pageRequest.page,
    size: pageRequest.size,
  };

  if (pageRequest.sort) {
    params.sort = `${pageRequest.sort.field},${pageRequest.sort.direction}`;
  }

  return params;
}

export function buildTransactionParams(
  filters: TxnFilterDto,
  pageRequest: PageRequestDto,
) {
  return {
    ...buildPageParams(pageRequest),
    ...removeEmptyValues(filters),
  };
}

function removeEmptyValues(source: object) {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== undefined && value !== ''),
  );
}
