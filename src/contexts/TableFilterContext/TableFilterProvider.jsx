import { createContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { produce, enableMapSet } from 'immer';
import { formatDate } from 'services/time';
import { extractSpaceAndMakeLower, search } from 'utils/helpers';
import { useNavigate } from 'react-router-dom';
export const TableFilterContext = createContext({});

enableMapSet();

const prepareQuery = ({ state, toggleSortPropertyValue, sortKey }) => {
  let query = {};

  if (sortKey) {
    query = toggleSortPropertyValue(sortKey);
  }

  const prepareMultiple = (key) => {
    const { search: searchStr, values, options } = state[key];

    const filteredOptions = options.filter((option) => search(option.label, searchStr));

    return filteredOptions
      .map((option) => option.value)
      .filter((value) => values && values.get(value));
  };

  const prepareNumberComparison = (key) => {
    const config = state[key];

    const lte = `${key}Lte`;
    const gte = `${key}Gte`;

    const lteValue = config.values?.[lte];
    const gteValue = config.values?.[gte];

    return {
      ...(lteValue && { [lte]: lteValue }),
      ...(gteValue && { [gte]: gteValue })
    };
  };

  const prepareDateComparison = (key) => {
    const config = state[key];

    const lte = `${key}Lte`;
    const gte = `${key}Gte`;

    const lteValue = formatDate(config.values?.[lte]);
    const gteValue = formatDate(config.values?.[gte]);

    return {
      ...(lteValue && { [lte]: lteValue }),
      ...(gteValue && { [gte]: gteValue })
    };
  };

  for (let key in state) {
    if (excludedKeys.includes(key)) {
      continue;
    }

    query = {
      ...query,
      ...(state[key].type === 'search' && {
        [key]: extractSpaceAndMakeLower(state[key].value)
      }),
      ...(state[key].type === 'multiple' && {
        [key]: prepareMultiple(key)
      }),
      ...(state[key].type === 'number-comparison' && prepareNumberComparison(key)),
      ...(state[key].type === 'date-comparison' && prepareDateComparison(key))
    };
  }

  return query;
};

export const TABLE_FILTER_ACTION_TYPES = {
  OPEN: 'OPEN',
  ANY: 'ANY',
  SET_SEARCH_VALUE: 'SET_SEARCH_VALUE',
  SET_ACTIVE_KEY_VALUES: 'SET_ACTIVE_KEY_VALUES',
  RESET_PROPERTY: 'RESET_PROPERTY',
  SET_VALUES_TO_ROOT_PROPERTY: 'SET_VALUES_TO_ROOT_PROPERTY',
  SET_ACTIVE_KEY: 'SET_ACTIVE_KEY'
};

export const MULTIPLE_MODE_BLUEPRINT_VALUES = {
  title: '',
  headerSearch: true,
  type: 'multiple',
  options: [],
  search: '',
  values: null,
  queryKey: '',
  touched: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case TABLE_FILTER_ACTION_TYPES.ANY:
      return {
        ...state,
        ...action.payload
      };
    case TABLE_FILTER_ACTION_TYPES.SET_SEARCH_VALUE:
      return produce(state, (draft) => {
        draft[state.activeKey].search = action.payload.value;
        return draft;
      });
    case TABLE_FILTER_ACTION_TYPES.SET_ACTIVE_KEY_VALUES:
      return produce(state, (draft) => {
        draft[state.activeKey].values = {
          ...draft[state.activeKey].values,
          ...action.payload
        };

        return draft;
      });
    case TABLE_FILTER_ACTION_TYPES.RESET_PROPERTY:
      return produce(state, (draft) => {
        const { key } = action;

        const { type } = draft[key];
        draft[key].touched = false;

        if (type === 'multiple') {
          draft[key].search = '';
          draft[key].values = null;
        }

        if (type === 'search') {
          draft[key].value = '';
        }

        if (type === 'date-comparison') {
          draft[key].values = {};
        }

        draft.query = prepareQuery({ state: draft, sortKey: '' });

        return draft;
      });
    case TABLE_FILTER_ACTION_TYPES.SET_ACTIVE_KEY:
      return {
        ...state,
        activeKey: action.payload.key
      };

    default:
      return state;
  }
};

const excludedKeys = ['x', 'y', 'mode', 'sx', 'type', 'activeKey', 'query'];

const TableFilterProvider = ({ children, value }) => {
  const buildInitialQuery = useRef(false);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    x: 0,
    y: 0,
    mode: 'idle',
    sx: {},
    type: 'multiple',
    activeKey: '',
    query: {},
    label: '',
    ...value
  });

  useEffect(() => {
    if (!buildInitialQuery.current) {
      dispatch({
        type: TABLE_FILTER_ACTION_TYPES.ANY,
        payload: { query: prepareQuery({ state: { ...state, ...value } }) }
      });

      buildInitialQuery.current = true;
    }
  }, [value, state]);

  const setValues = useCallback(
    (payload) => dispatch({ type: TABLE_FILTER_ACTION_TYPES.ANY, payload }),
    []
  );

  const handleWindowKeyDown = (e) => {
    if (e.key === 'Escape') {
      setValues({ mode: 'closed' });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, []);

  const resetProperty = useCallback((key) => {
    navigate({ search: '' });

    dispatch({
      type: TABLE_FILTER_ACTION_TYPES.RESET_PROPERTY,
      key
    });
  }, []);

  const setToActiveKeyValues = useCallback((payload) => {
    dispatch({
      type: TABLE_FILTER_ACTION_TYPES.SET_ACTIVE_KEY_VALUES,
      payload
    });
  }, []);

  const toggleSortPropertyValue = useCallback(
    (activeColumn) => {
      const payload = {
        [activeColumn]: state[activeColumn] === 'asc' ? 'desc' : 'asc'
      };
      dispatch({
        type: TABLE_FILTER_ACTION_TYPES.ANY,
        payload
      });

      return payload;
    },
    [state]
  );

  const handleApply = useCallback(
    (sortKey = '', type = 'filter') => {
      const { activeKey } = state;

      const query = prepareQuery({ state, sortKey, toggleSortPropertyValue });
      setValues({
        query,
        mode: 'closed',
        [activeKey]: {
          ...state[activeKey],
          touched: type === 'filter'
        }
      });
    },
    [state, setValues, toggleSortPropertyValue]
  );

  const handleEnter = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        handleApply();
      }
    },
    [handleApply]
  );

  const handleAll = useCallback(
    (value) => {
      const { activeKey } = state;
      const { options, search: input } = state[activeKey];

      const searchedOptions = options.filter((option) => search(option.label, input));

      const updatedMap = new Map();

      searchedOptions.forEach((option) => {
        updatedMap.set(option.value, value);
      });

      dispatch({
        type: TABLE_FILTER_ACTION_TYPES.ANY,
        payload: {
          [activeKey]: {
            ...state[activeKey],
            values: updatedMap
          }
        }
      });
    },
    [state]
  );

  const handleSearch = (e) => {
    const { activeKey } = state;
    setValues({
      [activeKey]: { ...state[activeKey], value: e.target.value }
    });
  };

  const setActiveKey = (key) =>
    dispatch({ type: TABLE_FILTER_ACTION_TYPES.SET_ACTIVE_KEY, payload: { key } });

  useEffect(() => {
    document.addEventListener('keypress', handleEnter);
    return () => document.removeEventListener('keypress', handleEnter);
  }, [handleEnter]);

  return (
    <TableFilterContext.Provider
      value={{
        ...state,
        filterDispatch: dispatch,
        setTableFilter: setValues,
        handleApply,
        setToActiveKeyValues,
        toggleSortPropertyValue,
        resetProperty,
        handleAll,
        ready: buildInitialQuery.current,
        handleSearch,
        setActiveKey
      }}>
      {children}
    </TableFilterContext.Provider>
  );
};

export default TableFilterProvider;
