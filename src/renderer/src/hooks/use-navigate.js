// useNavigation.js
import { useNavigate } from 'react-router-dom';

export function useNavigation() {
  const navigate = useNavigate();

  function navigateTo(destination) {
    navigate(destination);
  }

  return { navigateTo };
}
