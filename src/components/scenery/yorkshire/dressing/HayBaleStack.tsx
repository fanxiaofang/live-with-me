/** The three original field bales, now stored outside the sheepfold. */
export function HayBaleStack() {
  return <g id="sheep-pen-exterior-hay-bales" transform="translate(306, 30)" pointerEvents="none">
    <ellipse cx="-23" cy="41" rx="32" ry="6" fill="#30271b" opacity=".2" />
    <g data-stored-hay-bale transform="translate(-32, 22)">
      <ellipse cx="0" cy="12" rx="14" ry="9" fill="#d9b434" />
      <rect x="-14" y="0" width="28" height="12" fill="#eab308" />
      <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
      <line x1="-8" y1="0" x2="-8" y2="12" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
      <line x1="8" y1="0" x2="8" y2="12" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
      <circle cx="0" cy="0" r="4.5" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3,2" />
      <path d="M-14,8 Q-18,10 -20,13 M-12,12 Q-15,15 -17,18" stroke="#fde047" strokeWidth="0.7" fill="none" />
    </g>
    <g data-stored-hay-bale transform="translate(-10, 26)">
      <ellipse cx="0" cy="10" rx="13" ry="8" fill="#d9b434" />
      <rect x="-13" y="0" width="26" height="10" fill="#eab308" />
      <ellipse cx="0" cy="0" rx="13" ry="6.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
      <line x1="-7" y1="0" x2="-7" y2="10" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
      <line x1="7" y1="0" x2="7" y2="10" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
      <circle cx="0" cy="0" r="3.5" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3,2" />
    </g>
    <g data-stored-hay-bale transform="translate(-20, 10)">
      <ellipse cx="0" cy="9" rx="12" ry="7" fill="#d9b434" />
      <rect x="-12" y="0" width="24" height="9" fill="#eab308" />
      <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
      <line x1="-6" y1="0" x2="-6" y2="9" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
      <line x1="6" y1="0" x2="6" y2="9" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
      <circle cx="0" cy="0" r="3" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3,2" />
      <path d="M12,4 Q16,6 18,9" stroke="#fef08a" strokeWidth="0.7" fill="none" />
    </g>
  </g>;
}
