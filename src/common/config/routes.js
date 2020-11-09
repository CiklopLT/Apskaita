import React, {useEffect, useState} from 'react';
import { ScrollView } from 'react-native';
import {ListItem} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';

import UserMain from "../components/userMain";
import Login from "../components/login";
import Start from "../components/start";
import Notifications from "../components/notifications";
import AdditionalPersons from "../components/additionalPersons";
import ChangePassword from "../components/changePassword";
import PersonalData from "../components/personalData";
import Tax from "../components/tax";
import Meter from "../components/meter";
import News from "../components/news";
import Notes from "../components/notes";
import Ideas from "../components/ideas";
import Contacts from "../components/contacts";
import Docs from "../components/docs";
import Invoices from "../components/invoices";
import Finances from "../components/finances";
import Statements from "../components/statements";
import Tasks from "../components/tasks";
import Sms from "../components/sms";
import Email from "../components/email";
import Owners from "../components/owners";
import Debtors from "../components/debtors";
import PdfView from "../components/pdfView";
// import Votes from "../components/votes";

import * as request from '../../server/api';
import * as actions from '../actions/actions';
import alert_proceed from "../components/elements/alert_proceed";
import styles from '../components/styles/styles';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const Drawer = createDrawerNavigator();

const lists = {
  default: [
    {
      title: 'Mokėti mokesčius',
      icon: 'account-balance-wallet',
      page: 'Tax',
      check_data: 'taxes',
      requests: [
        {
          request: request.taxRequest,
          set_data: actions.set_current_tax_data,
        },
        {
          request: request.allTaxesRequest,
          set_data: actions.set_all_tax_data,
        },
      ],
    },
    {
      title: 'Deklaruoti skaitiklius',
      icon: 'format-list-numbered',
      page: 'Meter',
      check_data: 'meters',
      requests: [
        {
          request: request.meterRequest,
          set_data: actions.set_meter_data,
        },
        {
          request: request.meterHistoryRequest,
          set_data: actions.set_meter_history_data,
        },
      ],
    },
    {
      title: 'Informacija gyventojams',
      icon: 'perm-device-information',
      page: 'News',
      check_data: 'news',
      requests: [
        {
          request: request.newsRequest,
          set_data: actions.set_news_data,
        },
      ],
    },
    {
      title: 'Siūlyti darbus bendrijai',
      icon: 'chat',
      page: 'Ideas',
      check_data: 'ideas',
      requests: [
        {
          request: request.ideasRequest,
          set_data: actions.set_ideas_data,
        },
      ],
    },
    {
      title: 'Kontaktai',
      icon: 'contact-phone',
      page: 'Contacts',
      check_data: 'contacts',
      requests: [
        {
          request: request.contactsRequest,
          set_data: actions.set_contacts_data,
        },
        {
          request: request.serviceProvidersRequest,
          set_data: actions.set_service_providers_data,
        },
        {
          request: request.partnersRequest,
          set_data: actions.set_partners_data,
        },
      ],
    },
    {
      title: 'Bendrijos dokumentai',
      icon: 'description',
      page: 'Docs',
      check_data: 'docs',
      requests: [
        {
          request: request.docsRequest,
          set_data: actions.set_docs_data,
        },
      ],
    },
    {
      title: 'Bendrijos finansai',
      icon: 'euro-symbol',
      page: 'Finances',
      check_data: 'finances',
      requests: [
        {
          request: request.financesRequest,
          set_data: actions.set_finances_data,
        },
      ],
    }
  ],
  master: [
    {
      title: 'Administravimas',
      icon: 'event',
      page: 'Admin',
      requests: [],
    },
    {
      title: 'Valdymas',
      icon: 'supervisor-account',
      page: 'Management',
      requests: [],
    },
    {
      title: 'Finansai',
      icon: 'euro-symbol',
      page: 'Finances_admin'
    },
    {
      title: 'Gyventojų informacija',
      icon: 'info',
      page: 'Dwellers'
    },
    {
      title: 'Mano mokesčiai',
      icon: 'account-balance-wallet',
      page: 'Tax',
      check_data: 'taxes',
      requests: [
        {
          request: request.taxRequest,
          set_data: actions.set_current_tax_data,
        },
        {
          request: request.allTaxesRequest,
          set_data: actions.set_all_tax_data,
        },
      ],
    },
    {
      title: 'Mano skaitikliai',
      icon: 'format-list-numbered',
      page: 'Meter',
      check_data: 'meters',
      requests: [
        {
          request: request.meterRequest,
          set_data: actions.set_meter_data,
        },
        {
          request: request.meterHistoryRequest,
          set_data: actions.set_meter_history_data,
        },
      ],
    },
  ],
  admin: [
    {
      title: 'Dokumentai',
      icon: 'description',
      page: 'Docs',
      check_data: 'docs',
      requests: [
        {
          request: request.docsRequest,
          set_data: actions.set_docs_data,
        },
      ],
    },
    {
      title: 'Darbų nurodymai',
      icon: 'build',
      page: 'Tasks',
      check_data: 'tasks',
      requests: [
        {
          request: request.tasksRequest,
          set_data: actions.set_tasks_data,
        },
      ],
    },
    {
      title: 'Užrašinė',
      icon: 'note-add',
      page: 'Notes',
      check_data: 'notes',
      requests: [
        {
          request: request.notesRequest,
          set_data: actions.set_notes_data,
        },
      ],
    }
  ],
  management: [
    {
      title: 'Bendrijos darbai',
      icon: 'build',
      page: 'Ideas',
      check_data: 'ideas',
      requests: [
        {
          request: request.ideasRequest,
          set_data: actions.set_ideas_data,
        },
      ],
    },
    {
      title: 'Informuok gyventojus',
      icon: 'description',
      page: 'Inform'
    },
    {
      title: 'Kontaktai',
      icon: 'contact-phone',
      page: 'Contacts',
      check_data: 'contacts',
      requests: [
        {
          request: request.contactsRequest,
          set_data: actions.set_contacts_data,
        },
        {
          request: request.serviceProvidersRequest,
          set_data: actions.set_service_providers_data,
        },
        {
          request: request.partnersRequest,
          set_data: actions.set_partners_data,
        },
      ],
    },
  ],
  inform: [
    {
      title: 'Skelbti naujienose',
      icon: 'perm-device-information',
      page: 'News',
      check_data: 'news',
      requests: [
        {
          request: request.newsRequest,
          set_data: actions.set_news_data,
        },
      ],
    },
    {
      title: 'Skelbti el. laišku',
      icon: 'email',
      page: 'Email',
      check_data: 'docs',
      requests: [
        {
          request: request.emailRequest,
          set_data: actions.set_email_data,
        },
        {
          request: request.emailRecipientsRequest,
          set_data: actions.set_email_recipient_data,
        },
      ],
    },
    {
      title: 'Siųsti SMS',
      icon: 'textsms',
      page: 'Sms',
      check_data: 'sms',
      requests: [
        {
          request: request.smsRequest,
          set_data: actions.set_sms_data,
        },
        {
          request: request.smsCreditRequest,
          set_data: actions.set_sms_credit_data,
        },
        {
          request: request.smsRecipientsRequest,
          set_data: actions.set_sms_recipient_data,
        },
      ],
    }
  ],
  finances: [
    {
      title: 'Sąskaitos',
      icon: 'assessment',
      page: 'Invoices',
      check_data: 'invoices',
      requests: [
        {
          request: request.invoicesIssuedRequest,
          set_data: actions.set_invoices_data,
        },
        {
          request: request.invoicesReceivedRequest,
          set_data: actions.set_invoices_data,
        },
      ],
    },
    {
      title: 'Bankų išrašai',
      icon: 'account-balance',
      page: 'Statements',
      check_data: 'statements',
      requests: [
        {
          request: request.statementsRequest,
          set_data: actions.set_statements_data,
        }
      ],
    },
    {
      title: 'Bendrijos finansai',
      icon: 'euro-symbol',
      page: 'Finances',
      check_data: 'finances',
      requests: [
        {
          request: request.financesRequest,
          set_data: actions.set_finances_data,
        },
      ],
    }
  ],
  dwellers: [
    {
      title: 'Savininkai',
      icon: 'face',
      page: 'Owners',
      check_data: 'owners',
      requests: [
        {
          request: request.ownersRequest,
          set_data: actions.set_owners_data,
        },
      ],
    },
    {
      title: 'Skolininkai',
      icon: 'hourglass-empty',
      page: 'Debtors',
      check_data: 'debtors',
      requests: [
        {
          request: request.debtorsRequest,
          set_data: actions.set_debtors_data,
        },
      ],
    }
  ],
};


const CustomDrawer = ({ navigation, user, dispatch }) => {
  const [subPage, setSubPage] = useState(false);
  const [list, setList] = useState(lists.default);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  useEffect(() => {
    if (!subPage) {
      setList(Number(user.data.rights) === 3 ? lists.master : lists.default)
    }
  });

  const render_sub_page = (sub_page) => {
    if (sub_page === 'admin') setList(lists.admin);
    if (sub_page === 'management') setList(lists.management);
    if (sub_page === 'inform') setList(lists.inform);
    if (sub_page === 'finances') setList(lists.finances);
    if (sub_page === 'dwellers') setList(lists.dwellers);
  };

  const sub_page_by_page = {
    Admin: 'admin',
    Management: 'management',
    Inform: 'inform',
    Finances_admin: 'finances',
    Dwellers: 'dwellers',
  };

  const requestsAction = (page, requests, check_data)  => {
    setSpinnerVisible(true);
    if (sub_page_by_page[page]) {
      setSubPage(sub_page_by_page[page]);
      render_sub_page(sub_page_by_page[page]);
      setSpinnerVisible(false);
    } else {
      setSubPage(false);
      setList(Number(user.data.rights) === 3 ? lists.master : lists.default);
      if (Object.keys(user[check_data]).length) {
        navigation.navigate(page);
        setSpinnerVisible(false);
        return true;
      }

      const req_count = requests.length;
      requests.forEach( async (request, i) => {
        const data = await request.request();
        setSpinnerVisible(false);
        if (!data) {
          alert_proceed('Klaida', 'Nežinoma klaida');
          navigation.navigate('Home');
          return false;
        }
        if (data.status && data.data) {
          dispatch(request.set_data(data.data));
        }
        if (i+1 === req_count) {
          navigation.navigate(page);
        }
      });
    }
  };

  return (
    <ScrollView style={{ marginTop: getStatusBarHeight(true) }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      {
        !!subPage &&
        <ListItem
          key='back'
          titleStyle={{ ...styles.title, opacity: 1 }}
          title='Atgal'
          leftIcon={{name: 'chevron-left', color: '#194E8B'}}
          onPress={() => {
            setSubPage(false);
            setList(Number(user.data.rights) === 3 ? lists.master : lists.default);
          }}
        />
      }

      {
        list.map((item) => (
          <ListItem
            key={item.title}
            titleStyle={{ ...styles.title, opacity: 1 }}
            title={item.title}
            leftIcon={{name: item.icon, color: '#194E8B'}}
            chevronColor='#747474'
            onPress={() => requestsAction(item.page, item.requests, item.check_data)}
          />
        ))
      }
    </ScrollView>
  );
};

const StartContainer = connect(state => ({ user: state.user }))(Start);
const LogInContainer = connect(state => ({ user: state.user }))(Login);
const UserMainContainer = connect(state => ({ user: state.user }))(UserMain);
const MeterContainer = connect(state => ({ user: state.user }))(Meter);
const NewsContainer = connect(state => ({ user: state.user }))(News);
const IdeasContainer = connect(state => ({ user: state.user }))(Ideas);
const TaxContainer = connect(state => ({ user: state.user }))(Tax);
const DocsContainer = connect(state => ({ user: state.user }))(Docs);
const ContactsContainer = connect(state => ({ user: state.user }))(Contacts);
const FinancesContainer = connect(state => ({ user: state.user }))(Finances);
const InvoicesContainer = connect(state => ({ user: state.user }))(Invoices);
const TasksContainer = connect(state => ({ user: state.user }))(Tasks);
const NotesContainer = connect(state => ({ user: state.user }))(Notes);
const SmsContainer = connect(state => ({ user: state.user }))(Sms);
const EmailContainer = connect(state => ({ user: state.user }))(Email);
const NotificationsContainer = connect(state => ({ user: state.user }))(Notifications);
const PersonalDataContainer = connect(state => ({ user: state.user }))(PersonalData);
const AdditionalPersonsContainer = connect(state => ({ user: state.user }))(AdditionalPersons);
const ChangePasswordContainer = connect(state => ({ user: state.user }))(ChangePassword);
const StatementsContainer = connect(state => ({ user: state.user }))(Statements);
const OwnersContainer = connect(state => ({ user: state.user }))(Owners);
const DebtorsContainer = connect(state => ({ user: state.user }))(Debtors);
const CustomDrawerContainer = connect(state => ({ user: state.user }))(CustomDrawer);

export const MyDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContainer {...props} />}
      drawerType='slide'
    >
      <Drawer.Screen name="Start" component={StartContainer} />
      <Drawer.Screen name="Home" component={LogInContainer} />
      <Drawer.Screen name="UserMain" component={UserMainContainer} />
      <Drawer.Screen name="Tax" component={TaxContainer} />
      <Drawer.Screen name="Meter" component={MeterContainer} />
      <Drawer.Screen name="News" component={NewsContainer} />
      <Drawer.Screen name="Ideas" component={IdeasContainer} />
      <Drawer.Screen name="Contacts" component={ContactsContainer} />
      <Drawer.Screen name="Docs" component={DocsContainer} />
      <Drawer.Screen name="Finances" component={FinancesContainer} />
      <Drawer.Screen name="Invoices" component={InvoicesContainer} />
      <Drawer.Screen name="Notifications" component={NotificationsContainer} />
      <Drawer.Screen name="PersonalData" component={PersonalDataContainer} />
      <Drawer.Screen name="AdditionalPersons" component={AdditionalPersonsContainer} />
      <Drawer.Screen name="ChangePassword" component={ChangePasswordContainer} />
      <Drawer.Screen name="Tasks" component={TasksContainer} />
      <Drawer.Screen name="Notes" component={NotesContainer} />
      <Drawer.Screen name="Sms" component={SmsContainer} />
      <Drawer.Screen name="Email" component={EmailContainer} />
      <Drawer.Screen name="Statements" component={StatementsContainer} />
      <Drawer.Screen name="Owners" component={OwnersContainer} />
      <Drawer.Screen name="Debtors" component={DebtorsContainer} />
      <Drawer.Screen name="PdfView" component={PdfView} />
    </Drawer.Navigator>
  )
};

