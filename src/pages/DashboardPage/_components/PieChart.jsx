import { Stack, Box, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

const colors = ['#00AB55', '#2D99FF', '#FFE700', '#826AF9'];

const PieChart = ({ series = [], labels = [], ids = [], handleClick }) => {
  const settings = {
    series,
    labels: {
      show: false,
      name: {
        show: true
      }
    },
    options: {
      labels,
      legend: {
        show: false,
        position: 'bottom'
      },
      colors,
      chart: {
        events: {
          dataPointSelection: (a, b, config) => {
            if (typeof handleClick !== 'function') {
              return;
            }

            const clickedId = ids?.[config.dataPointIndex];

            handleClick(clickedId);
          },
          dataPointMouseEnter: function (event) {
            event.target.style.cursor = 'pointer';
          }
        }
      }
    }
  };

  return (
    <Stack direction="column" alignItems="center" width="100%">
      <ReactApexChart
        width={400}
        series={series}
        options={settings.options}
        type="pie"
        height={300}
      />
      <Stack width="100%">
        {labels.map((label, i) => (
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-start"
            alignItems="center"
            key={i}>
            <Box
              mr="8px"
              sx={{
                width: '12px',
                height: '12px',
                minWidth: '12px',
                minHeight: '12px',
                borderRadius: '50%',
                backgroundColor: colors[i]
              }}></Box>
            <Typography variant="body2" children={label} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default PieChart;
