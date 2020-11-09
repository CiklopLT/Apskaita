import {
  SET_TOKEN,
  DEL_TOKEN,
  SET_USER_MAIN_DATA,
  SET_USER_ADDITIONAL_DATA,
  SET_USER_SETTINGS_DATA,
  SET_USER_MASTER_ACCOUNT_DATA,
  UPDATE_USER_SETTINGS_DATA,
  SET_TOKEN_STATUS,
  SET_CURRENT_TAX_DATA,
  SET_ALL_TAX_DATA,
  SET_METER_DATA,
  SET_METER_HISTORY_DATA,
  SET_NEWS_DATA,
  SET_IDEAS_DATA,
  REMOVE_IDEAS_DATA,
  SET_VOTES_DATA,
  SET_VOTES_QUESTIONS_DATA,
  SET_CONTACTS_DATA,
  SET_SERVICE_PROVIDERS_DATA,
  SET_PARTNERS_DATA,
  SET_DOCS_DATA,
  SET_FINANCES_DATA,
  SET_TASKS_DATA,
  SET_NOTES_DATA,
  SET_SMS_DATA,
  SET_SMS_CREDIT_DATA,
  SET_SMS_RECIPIENT_DATA,
  SET_EMAIL_DATA,
  SET_EMAIL_RECIPIENT_DATA,
  SET_INVOICES_DATA,
  SET_STATEMENTS_DATA,
  SET_OWNERS_DATA,
  SET_DEBTORS_DATA,
  RESET_USER_DATA,
} from '../actions/constants';
const initialState = {
  token: '',
  token_status: 'UNKNOWN',
  data: {},
  inc: 0,
  taxes: {},
  meters: {},
  news: {},
  ideas: {},
  votes: {},
  contacts: {},
  service_providers: {},
  partners: {},
  docs: {},
  tasks: {},
  notes: {},
  sms: {},
  emails: {},
  invoices: {},
  statements: {},
  finances: {},
  owners: {},
  debtors: {}
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
      state.token = action.token;
      return { ...state, token: { ...state.token } };
    case DEL_TOKEN:
      state.token = '';
      return { ...state };
    case SET_TOKEN_STATUS:
      state.token_status = action.token_status;
      return { ...state, token_status: 'EEEEEE' };
    case SET_USER_MAIN_DATA:
      state.data.id = action.data.ownerId || action.data.payerID;
      state.data.name = action.data.name;
      state.data.surname = action.data.surname;
      if (action.data.community) state.data.community = action.data.community;
      if (action.data.masterAccounts) state.data.master_accounts = action.data.masterAccounts;
      return { ...state };
    case SET_USER_ADDITIONAL_DATA:
      state.data.name = action.data.name;
      state.data.surname = action.data.surname;
      state.data.login = action.data.username;
      state.data.address = action.data.address;
      state.data.corres_address = action.data.address_koresp;
      state.data.code = action.data.code;
      state.data.vat_code = action.data.pvmcode;
      state.data.bank_acc = action.data.bank_acc;
      state.data.phone = action.data.phone;
      state.data.email = action.data.email;
      state.data.book_id = action.data.knyg_nr;
      state.data.payer_id = action.data.payerID;
      if (action.data.rights) state.data.rights = action.data.rights;
      if (action.data.community) state.data.community = action.data.community;
      if (action.data.masterAccounts) state.data.master_accounts = action.data.masterAccounts;
      return { ...state };
    case SET_USER_SETTINGS_DATA:
      if (action.data){
        state.data.invoice_by_email = action.data.lapeliai_mail;
        state.data.invoice_by_post = action.data.lapeliai_fiz;
        state.data.sms = action.data.sms;
        state.data.notif_lapeliai = Number(action.data.notif_lapeliai);
        state.data.notif_declar = Number(action.data.notif_declar);
        state.data.notif_gyventojams = Number(action.data.notif_gyventojams);
        state.data.notif_darbai = Number(action.data.notif_darbai);
        state.data.notif_votings = Number(action.data.notif_votings);
        state.data.notif_votingExp = Number(action.data.notif_votingExp);
        state.data.notif_pirm_darbNur = Number(action.data.notif_pirm_darbNur);
        state.data.notif_pirm_darbComm = Number(action.data.notif_pirm_darbComm);
        state.data.notif_pirm_darbDone = Number(action.data.notif_pirm_darbDone);
        state.data.notif_pirm_darbCreated = Number(action.data.notif_pirm_darbCreated);
        state.data.notif_pirm_inv = Number(action.data.notif_pirm_inv);
        state.data.notif_pirm_newsComm = Number(action.data.notif_pirm_newsComm);
        state.data.extra_persons = {};
        if (action.data.extraPersons) {
          action.data.extraPersons.forEach((extra_person) => {
            const extra = {
              id: extra_person.id,
              name: extra_person.name,
              surname: extra_person.surname,
              email: extra_person.email,
              phone: extra_person.phone,
              address: extra_person.address,
              invoice_by_email: extra_person.invoice_by_email
            };
            state.data.extra_persons[extra.id] = extra;
          });
        }
      }
      return { ...state };
    case UPDATE_USER_SETTINGS_DATA:
      if (action.data.address_koresp) state.data.corres_address = action.data.address_koresp;
      if (action.data.email) state.data.email = action.data.email;
      if (action.data.phone) state.data.phone = action.data.phone;
      if (action.data.lapeliai_mail) state.data.invoice_by_email = action.data.lapeliai_mail;
      if (action.data.lapeliai_fiz) state.data.invoice_by_post = action.data.lapeliai_fiz;
      if (action.data.sms) state.data.sms = action.data.sms;
      if (action.data.notif_lapeliai) state.data.notif_lapeliai = action.data.notif_lapeliai;
      if (action.data.notif_declar) state.data.notif_declar = action.data.notif_declar;
      if (action.data.notif_gyventojams) state.data.notif_gyventojams = action.data.notif_gyventojams;
      if (action.data.notif_darbai) state.data.notif_darbai = action.data.notif_darbai;
      if (action.data.notif_votings) state.data.notif_votings = action.data.notif_votings;
      if (action.data.notif_votingExp) state.data.notif_votingExp = action.data.notif_votingExp;
      if (action.data.notif_pirm_darbNur) state.data.notif_pirm_darbNur = action.data.notif_pirm_darbNur;
      if (action.data.notif_pirm_darbComm) state.data.notif_pirm_darbComm = action.data.notif_pirm_darbComm;
      if (action.data.notif_pirm_darbDone) state.data.notif_pirm_darbDone = action.data.notif_pirm_darbDone;
      if (action.data.notif_pirm_darbCreated) state.data.notif_pirm_darbCreated = action.data.notif_pirm_darbCreated;
      if (action.data.notif_pirm_inv) state.data.notif_pirm_inv = action.data.notif_pirm_inv;
      if (action.data.notif_pirm_newsComm) state.data.notif_pirm_newsComm = action.data.notif_pirm_newsComm;
      return { ...state };
    case SET_USER_MASTER_ACCOUNT_DATA:
      state.data.master_accounts = action.master_accounts;
      return { ...state };
    case SET_CURRENT_TAX_DATA:
      state.taxes.current = {};
      state.taxes.current.date = action.data.date;
      state.taxes.current.fine = action.data.delspinigiai;
      state.taxes.current.payment = action.data.imokos;
      state.taxes.current.commissions = action.data.komisiniai;
      state.taxes.current.counted = action.data.priskaitymai;
      state.taxes.current.due = action.data.moketina;
      state.taxes.current.pdf = action.data.pdf;
      state.taxes.current.dept = action.data.skola;
      state.taxes.current.details = action.data.details;
      state.taxes.current.paylink = action.data.paylink;
      return { ...state };
    case SET_ALL_TAX_DATA:
      if (action.data) {
        state.taxes.all = [];
        action.data.forEach((tax) => {
          let changed_tax = {};
          changed_tax.date = tax.date;
          changed_tax.fine = tax.delspinigiai;
          changed_tax.payment = tax.imokos;
          changed_tax.commissions = tax.komisiniai;
          changed_tax.counted = tax.priskaitymai;
          changed_tax.due = tax.moketina;
          changed_tax.pdf = tax.pdf;
          changed_tax.dept = tax.skola;
          changed_tax.details = tax.details;
          state.taxes.all.push(changed_tax);
        });
      }
      return { ...state, taxes: state.taxes };
    case SET_METER_DATA:
      state.meters.available = action.data;
      return { ...state };
    case SET_METER_HISTORY_DATA:
      state.meters.history = action.data;
      return { ...state };
    case SET_NEWS_DATA:
      state.news.all = action.data;
      return { ...state };
    case SET_IDEAS_DATA:
      state.ideas.all = action.data;
      return { ...state };
    case REMOVE_IDEAS_DATA:
      state.ideas = {};
      return { ...state };
    case SET_VOTES_DATA:
      state.votes.all = action.data;
      return { ...state };
    case SET_VOTES_QUESTIONS_DATA:
      if (state.votes.all.rows && state.votes.all.rows[0]) {
        if (!state.votes.all.rows[0].questions) state.votes.all.rows[0].questions = [];
        state.votes.all.rows[0].questions.push(action.data);
      }
      return { ...state };
    case SET_CONTACTS_DATA:
      state.contacts.all = action.data;
      return { ...state };
    case SET_SERVICE_PROVIDERS_DATA:
      state.service_providers.all = action.data;
      return { ...state };
    case SET_PARTNERS_DATA:
      state.partners.all = action.data;
      return { ...state };
    case SET_DOCS_DATA:
      state.docs.all = action.data;
      return { ...state };
    case SET_FINANCES_DATA:
      let finances = action.data;
      let income_spread = [];
      let expense_spread = [];
      let exp_id = 1;
      let inc_unique_id = 1;
      let exp_unique_id = 1;
      if (finances.income) {
        finances.income.forEach((income) => {
          income.details && income.details.forEach((detail) => {
            income_spread.push({
              id: inc_unique_id,
              name: income.name,
              group_id: Number(income.tax_id),
              date: detail.date,
              value: detail.value
            });
            inc_unique_id += 1;
          })
        });
      }
      if (finances.expense) {
        finances.expense.forEach((expense) => {
          expense.details && expense.details.forEach((detail) => {
            expense_spread.push({
              id: exp_unique_id,
              name: expense.name,
              date: detail.date,
              group_id: exp_id,
              value: detail.value
            });
            exp_unique_id += 1;
          });
          exp_id += 1;
        });
      }
      finances.income = income_spread;
      finances.expense = expense_spread;
      state.finances.all = finances;
      return { ...state };
    case SET_TASKS_DATA:
      if (!state.tasks.all) state.tasks.all = [];
      action.data.rows.forEach((task) => {
        state.tasks.all.push(task);
      });
      return { ...state };
    case SET_NOTES_DATA:
      state.notes.all = action.data.rows;
      return { ...state };
    case SET_SMS_DATA:
      state.sms.all = action.data.rows || [];
      return { ...state };
    case SET_SMS_CREDIT_DATA:
      state.sms.credit = action.data.balance;
      return { ...state };
    case SET_SMS_RECIPIENT_DATA:
      state.sms.recipients = action.data.recipients;
      return { ...state };
    case SET_EMAIL_DATA:
      state.emails.all = action.data.rows || [];
      return { ...state };
    case SET_EMAIL_RECIPIENT_DATA:
      state.emails.recipients = action.data.recipients;
      return { ...state };
    case SET_INVOICES_DATA:
      let issued = [];
      let received = [];
      if (action.data.rows && action.data.rows.length) {
        action.data.rows.forEach(invoice => {
          if (invoice.type === 't') received.push(invoice);
          if (invoice.type === 'p') issued.push(invoice);
        });
      }
      if (issued.length) state.invoices.issued = issued;
      if (received.length) state.invoices.received = received;
      return { ...state };
    case SET_STATEMENTS_DATA:
      state.statements.all = action.data.rows;
      state.statements.accounts = action.data.accounts;
      return { ...state };
    case SET_OWNERS_DATA:
      state.owners.all = action.data.rows;
      return { ...state };
    case SET_DEBTORS_DATA:
      state.debtors.all = action.data.rows;
      return { ...state };
    case RESET_USER_DATA:
      state.data = {};
      state.inc = 0;
      state.taxes = {};
      state.meters = {};
      state.news = {};
      state.ideas = {};
      state.votes = {};
      state.contacts = {};
      state.service_providers = {};
      state.partners = {};
      state.docs = {};
      state.tasks = {};
      state.notes = {};
      state.sms = {};
      state.emails = {};
      state.invoices = {};
      state.statements = {};
      state.finances = {};
      state.owners = {};
      state.debtors = {};
      return { ...state };
    default:
      return state;
  }
}
