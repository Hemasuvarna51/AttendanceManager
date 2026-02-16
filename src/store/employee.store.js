import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEmployeeStore = create(
  persist(
    (set) => ({
      employees: [],
      
      addEmployee: (employee) => set((state) => ({ 
        employees: [...state.employees, employee] 
      })),
      
      updateEmployee: (id, updatedEmployee) => set((state) => ({
        employees: state.employees.map((emp) => 
          emp.id === id ? updatedEmployee : emp
        )
      })),
      
      deleteEmployee: (id) => set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id)
      })),
    }),
    {
      name: 'employee-storage',
    }
  )
);
