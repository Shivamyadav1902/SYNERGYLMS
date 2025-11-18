
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { SetView, Fee, FeePayment } from '../types';
import { MOCK_FEES, MOCK_FEE_PAYMENTS } from '../data/fees';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { ChevronLeftIcon } from '../components/icons';

interface FeesPageProps {
  setView: SetView;
}

const FeesPage: React.FC<FeesPageProps> = ({ setView }) => {
  const { user } = useAuth();

  if (!user) return null;

  const myFees = MOCK_FEES.filter(f => f.studentId === user.id);
  const myPayments = MOCK_FEE_PAYMENTS.filter(p => myFees.some(f => f.id === p.feeId));
  const outstandingFees = myFees.filter(f => !f.paid);
  const totalOutstanding = outstandingFees.reduce((acc, fee) => acc + fee.amount, 0);

  return (
    <div className="space-y-6">
      <button onClick={() => setView({ type: 'dashboard' })} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
        <ChevronLeftIcon className="h-4 w-4 mr-1"/>
        Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold">My Fees</h1>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold">Outstanding Balance</h2>
          <p className={`text-4xl font-extrabold mt-2 ${totalOutstanding > 0 ? 'text-red-500' : 'text-green-500'}`}>
            ${totalOutstanding.toFixed(2)}
          </p>
          {totalOutstanding > 0 && <Button className="mt-4">Pay Now</Button>}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Fee Details</h2>
          <Card className="p-4">
            <div className="space-y-3">
              {myFees.length > 0 ? myFees.map(fee => (
                <div key={fee.id} className="flex items-center justify-between p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                  <div>
                    <p className="font-semibold">{fee.description}</p>
                    <p className="text-sm text-secondary-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${fee.amount.toFixed(2)}</p>
                    {fee.paid ? <Badge color="green">Paid</Badge> : <Badge color="red">Unpaid</Badge>}
                  </div>
                </div>
              )) : <p className="text-center text-secondary-500 py-4">No fees found.</p>}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          <Card className="p-4">
            <div className="space-y-3">
              {myPayments.length > 0 ? myPayments.map(payment => {
                const fee = myFees.find(f => f.id === payment.feeId);
                return (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                    <div>
                      <p className="font-semibold">${payment.amount.toFixed(2)} via {payment.method}</p>
                      <p className="text-sm text-secondary-500">Paid on {new Date(payment.paymentDate).toLocaleDateString()}</p>
                      <p className="text-xs text-secondary-400">For: {fee?.description || 'N/A'}</p>
                    </div>
                  </div>
                )
              }) : <p className="text-center text-secondary-500 py-4">No payment history.</p>}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FeesPage;
