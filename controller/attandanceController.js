import Attendance from "../modals/attendanceModal.js";
import Employee from "../modals/employesModal.js";

// Get all employees with attendance status
export const getAllAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active employees
    const employees = await Employee.find({ status: "active" }).select(
      "fullName position department profileImage"
    );

    // Get today's attendance records
    const todayAttendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    // Map attendance records to employees
    const employeesWithStatus = employees.map((employee) => {
      const attendanceRecord = todayAttendance.find(
        (record) => record.employeeId.toString() === employee._id.toString()
      );

      return {
        _id: employee._id,
        fullName: employee.fullName,
        position: employee.position,
        department: employee.department,
        profileImage: employee.profileImage,
        status: attendanceRecord ? attendanceRecord.status : "Absent",
        task: attendanceRecord ? attendanceRecord.task : "--",
        checkIn: attendanceRecord ? attendanceRecord.checkIn : null,
        checkOut: attendanceRecord ? attendanceRecord.checkOut : null,
        workHours: attendanceRecord ? attendanceRecord.workHours : 0,
      };
    });

    res.status(200).json({
      success: true,
      attendance: employeesWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update attendance status
export const updateAttendance = async (req, res) => {
  try {
    const { employeeId, status, task } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (attendance) {
      attendance.status = status;
      attendance.task = task;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        employeeId,
        date: today,
        checkIn: new Date(),
        status,
        task,
      });
    }

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete attendance record
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    await attendance.deleteOne();

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
