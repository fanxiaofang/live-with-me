import { useCallback, useState } from 'react';
import { useTimerScope } from '../../shared/timers/useTimerScope';
export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timers = useTimerScope();
  const triggerToast = useCallback((message: string) => { setToastMessage(message); timers.schedule('toast', () => setToastMessage(null), 3200); }, [timers]);
  return { toastMessage, triggerToast };
}
