import Employee from "../modals/employesModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc    Login employee
// @route   POST /api/employees/login
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (employee && (await bcrypt.compare(password, employee.password))) {
      res.json({
        _id: employee._id,
        fullName: employee.fullName,
        email: employee.email,
        token: generateToken(employee._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new employee
// @route   POST /api/employees/register
const createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      department,
      position,
      dateOfJoining,
      password,
    } = req.body;

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await Employee.create({
      fullName,
      email,
      phoneNumber,
      department,
      position,
      dateOfJoining,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: employee._id,
      fullName: employee.fullName,
      email: employee.email,
      token: generateToken(employee._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await employee.deleteOne();
    res.json({
      message: "Employee removed",
      data: {
        _id: employee._id,
        fullName: employee.fullName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        department: employee.department,
        position: employee.position,
        dateOfJoining: employee.dateOfJoining,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    const employees = await Employee.find({
      $or: [
        { fullName: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { position: searchRegex },
      ],
      status: "active", // Only search active employees
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  loginEmployee,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
