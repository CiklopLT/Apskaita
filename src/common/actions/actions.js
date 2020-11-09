import {
  LOGIN,
  SET_TOKEN,
  DEL_TOKEN,
  SET_USER_MAIN_DATA,
  SET_USER_ADDITIONAL_DATA,
  SET_USER_MASTER_ACCOUNT_DATA,
  SET_TOKEN_STATUS,
  SET_USER_SETTINGS_DATA,
  UPDATE_USER_SETTINGS_DATA,
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
  RESET_USER_DATA
} from './constants';
// import { loginRequest } from '../../server/api';

export function login() {
  return {
    type: LOGIN,
    payload: {},
    // payload: loginRequest()
  };
}

export function set_token(token) {
  return {
    type: SET_TOKEN,
    token,
  };
}

export function del_token() {
  return {
    type: DEL_TOKEN,
  };
}

export function set_token_status(token_status) {
  return {
    type: SET_TOKEN_STATUS,
    token_status,
  };
}

export function set_user_main_data(data) {
  return {
    type: SET_USER_MAIN_DATA,
    data
  };
}

export function set_user_additional_data(data) {
  return {
    type: SET_USER_ADDITIONAL_DATA,
    data
  };
}

export function set_user_settings_data(data) {
  return {
    type: SET_USER_SETTINGS_DATA,
    data
  };
}

export function set_user_master_accounts(master_accounts) {
  return {
    type: SET_USER_MASTER_ACCOUNT_DATA,
    master_accounts,
  };
}

export function reset_user_data() {
  return {
    type: RESET_USER_DATA
  };
}

export function update_user_settings_data(data) {
  return {
    type: UPDATE_USER_SETTINGS_DATA,
    data
  };
}

export function set_current_tax_data(data) {
  return {
    type: SET_CURRENT_TAX_DATA,
    data
  };
}

export function set_all_tax_data(data) {
  return {
    type: SET_ALL_TAX_DATA,
    data
  };
}

export function set_meter_data(data) {
  return {
    type: SET_METER_DATA,
    data
  };
}

export function set_meter_history_data(data) {
  return {
    type: SET_METER_HISTORY_DATA,
    data
  };
}

export function set_news_data(data) {
  return {
    type: SET_NEWS_DATA,
    data
  };
}

export function set_ideas_data(data) {
  return {
    type: SET_IDEAS_DATA,
    data
  };
}

export function remove_ideas_data() {
  return {
    type: REMOVE_IDEAS_DATA,
  };
}

export function set_votes_data(data) {
  return {
    type: SET_VOTES_DATA,
    data
  };
}

export function add_votes_questions_data(data, vote_id) {
  return {
    type: SET_VOTES_QUESTIONS_DATA,
    data,
    vote_id
  };
}

export function set_contacts_data(data) {
  return {
    type: SET_CONTACTS_DATA,
    data
  };
}

export function set_docs_data(data) {
  return {
    type: SET_DOCS_DATA,
    data
  };
}

export function set_finances_data(data) {
  return {
    type: SET_FINANCES_DATA,
    data
  };
}

export function set_service_providers_data(data) {
  return {
    type: SET_SERVICE_PROVIDERS_DATA,
    data
  };
}

export function set_partners_data(data) {
  return {
    type: SET_PARTNERS_DATA,
    data
  };
}

export function set_tasks_data(data) {
  return {
    type: SET_TASKS_DATA,
    data
  };
}

export function set_notes_data(data) {
  return {
    type: SET_NOTES_DATA,
    data
  };
}

export function set_sms_data(data) {
  return {
    type: SET_SMS_DATA,
    data
  };
}

export function set_sms_credit_data(data) {
  return {
    type: SET_SMS_CREDIT_DATA,
    data
  };
}

export function set_sms_recipient_data(data) {
  return {
    type: SET_SMS_RECIPIENT_DATA,
    data
  };
}

export function set_email_data(data) {
  return {
    type: SET_EMAIL_DATA,
    data
  };
}

export function set_email_recipient_data(data) {
  return {
    type: SET_EMAIL_RECIPIENT_DATA,
    data
  };
}

export function set_invoices_data(data) {
  return {
    type: SET_INVOICES_DATA,
    data
  };
}

export function set_statements_data(data) {
  return {
    type: SET_STATEMENTS_DATA,
    data
  };
}

export function set_owners_data(data) {
  return {
    type: SET_OWNERS_DATA,
    data
  };
}

export function set_debtors_data(data) {
  return {
    type: SET_DEBTORS_DATA,
    data
  };
}

