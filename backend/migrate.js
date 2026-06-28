const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://pcztdmemhxngtmbumdgi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjenRkbWVtaHhuZ3RtYnVtZGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MTgxNzIsImV4cCI6MjA5ODE5NDE3Mn0.UhkeYfQic1TDI6qvJzeOvzQmHYLbVB8_ZhvsKEpNEvo');

(async () => {
  // Try to update with bank_accounts field - if column doesn't exist it will fail
  const { data, error } = await supabase.from('settings').select('*').limit(1).single();
  console.log('Current settings:', data);
  
  // Try adding bank_accounts to existing record
  const { data: updated, error: updateError } = await supabase
    .from('settings')
    .update({ bank_accounts: JSON.stringify([{ bankName: data.bank_name, accountTitle: data.account_title, accountNumber: data.account_number, iban: data.iban, branchCode: data.branch_code }]) })
    .eq('id', data.id)
    .select();
  
  if (updateError) {
    console.log('Column might not exist:', updateError.message);
  } else {
    console.log('Updated with bank_accounts:', updated);
  }
})();
