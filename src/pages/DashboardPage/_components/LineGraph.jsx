import { useState } from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import ReactChart from 'react-apexcharts';
import CardWrapper from './CardWrapper';
import { MySelect } from 'components/form';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { httpGetBugTicketsByDate } from 'data/ticket';
import Spinner from 'components/Spinner';
import { MONTH_OPTIONS, YEAR_OPTIONS } from 'services/time';
import useUserStore from 'clientStore/useUserStore';

const date = new Date();

const LineGraph = () => {
  const { t } = useTranslation();
  const { project } = useUserStore();
  const theme = useTheme();
  const [values, setValues] = useState({
    month: date.getMonth() + 1,
    year: date.getFullYear()
  });

  const projectId = project?.value;

  const { data, isLoading } = useQuery({
    queryKey: ['tickets-by-date', values, projectId],
    queryFn: () => httpGetBugTicketsByDate({ ...values, projectId }),
    select: ({ data: { data } }) =>
      (Array.isArray(data) ? data : []).reduce(
        (acc, cur) => ({
          ...acc,
          [cur.name]: [...(Array.isArray(acc[cur.name]) ? acc[cur.name] : []), cur]
        }),
        {}
      )
  });

  const x = Object.entries(data || {}).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        ...acc[key],
        ...value.reduce((iacc, icur) => ({ ...iacc, [icur.day]: icur }), {})
      }
    }),
    {}
  );

  const xCategories = Array.from(
    new Set(
      Object.values(data || {})
        .reduce((acc, cur) => [...acc, ...cur], [])
        .map((item) => item.day)
    )
  );

  const preparedData = Object.entries(x).map(([name, value]) => {
    // eslint-disable-next-line no-prototype-builtins
    const counts = xCategories.map((date) => (value.hasOwnProperty(date) ? value[date].count : 0));

    return {
      name,
      data: counts
    };
  });

  const schema = {
    options: {
      grid: {
        borderColor: theme.palette.grey[200]
      },
      chart: {
        id: 'basic-bar'
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: xCategories
      },
      yaxis: {
        max: 20,
        labels: {
          formatter: (value) => {
            const val = parseInt(value, 10);

            if (isNaN(val)) {
              return '-';
            }

            return val;
          }
        },
        axisBorder: {
          show: false,
          offsetX: 0,
          offsetY: 0
        }
      },
      dataLabels: {
        enabled: true
      }
    },
    series: preparedData
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <CardWrapper
      contentSx={{}}
      rootSx={{ minHeight: '400px' }}
      title={
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb="8px">
          <Typography children={t('Line Graph')} />
          <Stack direction="row" columnGap={'20px'}>
            <MySelect
              name="year"
              size="small"
              options={YEAR_OPTIONS}
              label={t('Year')}
              value={values.year}
              onChange={handleChange}
            />
            <MySelect
              name="month"
              size="small"
              options={MONTH_OPTIONS}
              label={t('Month')}
              value={values.month}
              onChange={handleChange}
            />
          </Stack>
        </Stack>
      }>
      <Spinner loading={isLoading}>
        <ReactChart type="line" series={schema.series} options={schema.options} height={400} />
      </Spinner>
    </CardWrapper>
  );
};

export default LineGraph;
