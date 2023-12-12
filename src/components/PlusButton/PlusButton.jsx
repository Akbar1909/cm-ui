import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MyButton from 'components/MyButton';

const PlusButton = ({ children, to = '', variant = 'contained' }) => {
  return (
    <MyButton
      to={to}
      variant={variant}
      startIcon={<FontAwesomeIcon icon={faPlus} className="small-icon" />}>
      {children}
    </MyButton>
  );
};

export default PlusButton;
