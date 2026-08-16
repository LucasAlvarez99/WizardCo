/* src/icons/statusIcons.jsx — íconos de feedback y estado */

const IconCheck = (p) => <IconBase {...p}><polyline points="20 6 9 17 4 12" /></IconBase>;
const IconAlert = (p) => <IconBase {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></IconBase>;
const IconShield = (p) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><polyline points="9 12 11 14 15 10" /></IconBase>;
const IconBadgeCheck = (p) => <IconBase {...p}><path d="M12 2l2.4 1.2 2.7-.3 1.2 2.4 2.4 1.2-.3 2.7 1.2 2.4-1.2 2.4.3 2.7-2.4 1.2-1.2 2.4-2.7-.3L12 22l-2.4-1.2-2.7.3-1.2-2.4-2.4-1.2.3-2.7L2.4 12.4l1.2-2.4-.3-2.7 2.4-1.2L7.9 3.2l2.7.3Z" /><polyline points="9 12 11 14 15 10" /></IconBase>;
const IconLoader = (p) => <IconBase {...p} className={(p.className || "") + " icon-spin"}><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></IconBase>;
const IconStar = (p) => <IconBase {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></IconBase>;
const IconTruck = (p) => <IconBase {...p}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></IconBase>;
const IconPackage = (p) => <IconBase {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><polyline points="3.27 8 12 13 20.73 8" /><line x1="12" y1="22" x2="12" y2="13" /></IconBase>;
const IconPrinter = (p) => <IconBase {...p}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></IconBase>;
