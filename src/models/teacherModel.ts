class Teacher {
  id: string;
  name: string;
  age: number;
  subject: string;
  email: string;
  yearsOfExperience: number;
  sectionAssigned: string;

  constructor(
    id: string,
    name: string,
    age: number,
    subject: string,
    email: string,
    yearsOfExperience: number,
    sectionAssigned: string
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.subject = subject;
    this.email = email;
    this.yearsOfExperience = yearsOfExperience;
    this.sectionAssigned = sectionAssigned;
  }
}

export default Teacher;
