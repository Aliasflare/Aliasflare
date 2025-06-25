import './App.css'
import { createApp } from 'vue'
import App from './App.vue'
import Router from '@/Router'
import { AppState } from '@/AppState';

const app = createApp(App);
app.config.globalProperties.navigator = navigator;
app.config.globalProperties.window = window;
app.config.globalProperties.document = document;
app.use(Router);

import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Button from 'primevue/button';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ToggleButton from 'primevue/togglebutton';
import ToggleSwitch from 'primevue/toggleswitch';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Message from 'primevue/message';
import ColorPicker from 'primevue/colorpicker';
import Select from 'primevue/select';
import IftaLabel from 'primevue/iftalabel';
import Password from 'primevue/password';
import ConfirmDialog from 'primevue/confirmdialog';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';

app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
    ripple: true
});
app.use(ConfirmationService);
app.use(ToastService);
app.component('Toast', Toast);
app.component('ConfirmPopup', ConfirmPopup);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Tag', Tag);
app.component('ToggleButton', ToggleButton);
app.component('ToggleSwitch', ToggleSwitch);
app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('Tab', Tab);
app.component('Menubar', Menubar);
app.component('Avatar', Avatar);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('Message', Message);
app.component('ColorPicker', ColorPicker);
app.component('Select', Select);
app.component('IftaLabel', IftaLabel);
app.component('Password', Password);
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);

//app.use(vuetify);
app.mount('#app');

//@ts-ignore
window.AppState = AppState;