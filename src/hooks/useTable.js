import { useReducer } from 'react';
import { factoryReducer } from 'utils/helpers';

const initialState = {
  page: 1,
  size: 10,
  search: ''
};

export const USE_TABLE_ACTION_TYPES = {
  SET_DYNAMIC_VALUES: 'setDynamicValues'
};

const useTable = (externalState) => {
  const [tableState, dispatch] = useReducer(
    factoryReducer(USE_TABLE_ACTION_TYPES.SET_DYNAMIC_VALUES),
    { ...initialState, ...externalState }
  );

  const setDynamicValues = (payload) =>
    dispatch({ type: USE_TABLE_ACTION_TYPES.SET_DYNAMIC_VALUES, payload });

  const handleSizeChange = (size) => setDynamicValues({ size });

  return {
    tableState,
    tableDispatch: dispatch,
    setDynamicValues,
    handleSizeChange
  };
};

export default useTable;
