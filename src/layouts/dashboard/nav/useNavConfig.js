import { useTheme } from '@mui/material/styles';
import USER_ROLES from 'data/user/user.constants';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faBriefcase,
  faTicket,
  faBuildingColumns,
  faUserTie,
  faLaptopFile
} from '@fortawesome/free-solid-svg-icons';

const FONT_SIZE = '1.5rem';

const useNavConfig = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fill = theme.palette.primary.main;
  return [
    {
      title: t('Dashboard'),
      path: '/dashboard/app',
      icon: <FontAwesomeIcon icon={faChartSimple} color={fill} fontSize={FONT_SIZE} />,
      roles: [
        USER_ROLES.MANAGER,
        USER_ROLES.CLIENT,
        USER_ROLES.EMPLOYEE,
        USER_ROLES.SALES,
        USER_ROLES.SUPPORT,
        USER_ROLES.DIRECTOR
      ]
    },
    {
      title: t('Tickets'),
      path: '/dashboard/tickets',
      icon: <FontAwesomeIcon icon={faTicket} color={fill} fontSize={FONT_SIZE} />,
      roles: [
        USER_ROLES.MANAGER,
        USER_ROLES.CLIENT,
        USER_ROLES.EMPLOYEE,
        USER_ROLES.SALES,
        USER_ROLES.SUPPORT,
        USER_ROLES.DIRECTOR
      ]
    },
    {
      title: t('Clients'),
      path: '/dashboard/clients',
      icon: <FontAwesomeIcon icon={faBriefcase} color={fill} fontSize={FONT_SIZE} />,
      roles: [
        USER_ROLES.DIRECTOR,
        USER_ROLES.MANAGER,
        USER_ROLES.EMPLOYEE,
        USER_ROLES.SALES,
        USER_ROLES.SUPPORT
      ]
    },

    {
      title: t('Organizations'),
      path: '/dashboard/organizations',
      icon: <FontAwesomeIcon icon={faBuildingColumns} color={fill} fontSize={FONT_SIZE} />,
      roles: [
        USER_ROLES.DIRECTOR,
        USER_ROLES.MANAGER,
        USER_ROLES.EMPLOYEE,
        USER_ROLES.SALES,
        USER_ROLES.SUPPORT
      ]
    },
    {
      title: t('Projects'),
      path: '/dashboard/projects',
      icon: <FontAwesomeIcon icon={faLaptopFile} color={fill} fontSize={FONT_SIZE} />,
      roles: [USER_ROLES.MANAGER]
    },
    {
      title: t('Employees'),
      path: '/dashboard/user',
      icon: <FontAwesomeIcon icon={faUserTie} color={fill} fontSize={FONT_SIZE} />,
      roles: [USER_ROLES.MANAGER, USER_ROLES.DIRECTOR]
    }

    // {
    //   title: t('Settings'),
    //   path: '/dashboard/settings',
    //   icon: <SettingsIcon />,
    //   roles: [USER_ROLES.MANAGER]
    // }
  ];
};

export default useNavConfig;
