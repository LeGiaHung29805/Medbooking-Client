// app/Doctor/DashboardTab.tsx
import DashboardStats from "./DashboardStats";
import TodayAppointments from "./TodayAppointments";
import WaitingPatients from "./WaitingPatients";
import ExamInProgress from "./ExamInProgress";

export default function DashboardTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tổng quan hôm nay</h1>
      
      <DashboardStats 
        stats={{
          totalAppointments: 15,
          completed: 9,
          waiting: 3,
          inProgress: 3
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodayAppointments 
            appointments={[]} 
            waitingPatients={[]} 
            medicalRecords={[]}
            searchTerm=""
            statusFilter="all"
            currentPage={1}
            itemsPerPage={5}
            totalPages={1}
            paginatedAppointments={[]}
            getStatusInfo={() => ({ cls: "", icon: null, text: "" })}
            getPriorityColor={() => ""}
            getPriorityText={() => ""}
            setSearchTerm={() => {}}
            setStatusFilter={() => {}}
            setCurrentPage={() => {}}
            handleViewAppointmentDetail={() => {}}
            handleStartExam={() => {}}
          />
        </div>
        
        <div className="space-y-6">
          <ExamInProgress 
            appointments={[]}
            waitingPatients={[]}
            medicalRecords={[]}
            currentDoctor={null}
            getPriorityColor={() => ""}
            getPriorityText={() => ""}
            handleStartExam={() => {}}
          />
          
          <WaitingPatients 
            waitingPatients={[]}
            medicalRecords={[]}
            getStatusInfo={() => ({ cls: "", icon: null, text: "" })}
            getPriorityColor={() => ""}
            getPriorityText={() => ""}
            handleViewPatientDetail={() => {}}
            handleStartExam={() => {}}
          />
        </div>
      </div>
    </div>
  );
}