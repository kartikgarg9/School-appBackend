class Homework {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  subject: string;
  assignedBy: string;
  status: string;

  constructor(
    id: string,
    title: string,
    description: string,
    dueDate: Date,
    subject: string,
    assignedBy: string,
    status: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.subject = subject;
    this.assignedBy = assignedBy;
    this.status = status;
  }
}

export default Homework;
