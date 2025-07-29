import React from 'react' 
import CategoryWiseExpenses from '@/components/CategoryWiseExpenses'
import ExpenseForm from '@/components/ExpenseForm'
const page = () => {
  return (
    <div>
      <ExpenseForm />
      <CategoryWiseExpenses />
    </div>
  )
}

export default page