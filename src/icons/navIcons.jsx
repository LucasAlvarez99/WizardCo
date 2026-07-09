/* src/icons/navIcons.jsx — íconos de navegación y layout */

const IconSearch = (p) => <IconBase {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconBase>;
const IconMenu = (p) => <IconBase {...p}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></IconBase>;
const IconX = (p) => <IconBase {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconBase>;
const IconChevronDown = (p) => <IconBase {...p}><polyline points="6 9 12 15 18 9" /></IconBase>;
const IconChevronLeft = (p) => <IconBase {...p}><polyline points="15 18 9 12 15 6" /></IconBase>;
const IconSliders = (p) => <IconBase {...p}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></IconBase>;
const IconLayers = (p) => <IconBase {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></IconBase>;
const IconWizardHat = (p) => (
  <IconBase {...p}>
    <path d="M12 2c-1.2 2.6-2 5-2 7 0 1.1.5 1.6 1.4 1.9L4 15.5c-.7.25-.7 1.2 0 1.45L11.4 19a3 3 0 0 0 1.2 0l7.4-2.05c.7-.25.7-1.2 0-1.45l-7.4-4.6c.9-.3 1.4-.8 1.4-1.9 0-2-.8-4.4-2-7Z" />
    <ellipse cx="12" cy="17.2" rx="8.4" ry="1.9" />
  </IconBase>
);
