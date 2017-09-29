import { ProfileModal } from '../modals/profile/profile';
import { AboutModal } from '../modals/about/about';
import { SessionInfoModal } from '../modals/session-info/session-info';
export class Pages {
  title: string;
  component: Object;
}

export const PAGES = [
  { title: 'Profile', component: ProfileModal },
  { title: 'About', component: AboutModal },
];

export const SESSION_PAGES = [
  { title: 'My Items', component: "", function: "switchSegments" },
  { title: 'List Users', component: null, function: "openModal" },
  { title: 'Bill Info', component: SessionInfoModal, function: "openModal" },
  { title: 'Bill Image', component: null, function: "openModal" },
  { title: 'Leave Bill', component: "", function: "leaveSession" },
];
