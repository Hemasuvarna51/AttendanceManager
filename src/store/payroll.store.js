import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePayrollStore = create(
  persist(
    (set, get) => ({
      payrollRecords: [],
      
      // Add a new payroll record
      addPayrollRecord: (record) => set((state) => ({
        payrollRecords: [...state.payrollRecords, {
          ...record,
          id: record.id || `payroll-${Date.now()}`,
          createdAt: record.createdAt || new Date().toISOString()
        }]
      })),
      
      // Add multiple payroll records (for batch payroll processing)
      addPayrollRecords: (records) => set((state) => {
        const newRecords = records.map(record => ({
          ...record,
          id: record.id || `payroll-${Date.now()}-${Math.random()}`,
          createdAt: record.createdAt || new Date().toISOString()
        }));
        console.log('Payroll Store - Adding records:', newRecords);
        return {
          payrollRecords: [...state.payrollRecords, ...newRecords]
        };
      }),
      
      // Get payroll records for a specific employee
      // note: uses `get` to read current state
      getEmployeePayroll: (employeeId) => {
        const { payrollRecords } = get();
        return payrollRecords.filter(
          record => record.employeeId === employeeId || record.id === employeeId
        );
      },
      
      // Update a payroll record
      updatePayrollRecord: (recordId, updates) => set((state) => ({
        payrollRecords: state.payrollRecords.map(record =>
          record.id === recordId ? { ...record, ...updates } : record
        )
      })),
      
      // Delete a payroll record
      deletePayrollRecord: (recordId) => set((state) => ({
        payrollRecords: state.payrollRecords.filter(record => record.id !== recordId)
      })),
      
      // Get all payroll records
      getAllPayroll: (state) => state.payrollRecords,
    }),
    {
      name: 'payroll-storage',
    }
  )
);
