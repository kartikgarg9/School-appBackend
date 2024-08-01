class Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  email: string;
  enrolledCourses: string[]; // An array of course IDs or names

  constructor(
    id: string,
    name: string,
    age: number,
    grade: string,
    email: string,
    enrolledCourses: string[]
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.grade = grade;
    this.email = email;
    this.enrolledCourses = enrolledCourses;
  }
}

export default Student;
