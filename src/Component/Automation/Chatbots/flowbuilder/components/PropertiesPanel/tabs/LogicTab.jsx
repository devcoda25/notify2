import React from 'react'
import { useFormContext } from 'react-hook-form'
import ConditionalLogicTab from '../../ConditionalLogicTab'

export default function LogicTab() {
  const { getValues, resetField, setValue } = useFormContext()

  const variables = [
    { name: 'country', label: 'Country Code', type: 'string' },
    { name: 'age', label: 'User Age', type: 'number' },
    { name: 'message', label: 'Last Message', type: 'string' },
    { name: 'lastSeenAt', label: 'Last Seen (date)', type: 'date' },
  ]
  
  return (
      <ConditionalLogicTab
        value={getValues()}
        onChange={(v) => {
          setValue('branches', v.branches, { shouldDirty: true });
        }}
        variables={variables}
        initialTestContext={{ country: 'US', age: 21, message: 'refund please' }} 
        branchTargets={[
          { id: 'continue', label: 'Continue' },
          { id: 'end', label: 'End Session' }
        ]}
      />
  )
}
