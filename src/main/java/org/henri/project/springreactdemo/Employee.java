package org.henri.project.springreactdemo;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Objects;

@Entity // JPA annotation denotes a whole class for storage in relational db.
public class Employee {
    private @Id
    @GeneratedValue Long id;  // JPA annotation to note primary key and that its generated auto when needed.
    private String firstName;
    private String lastName;
    private String description;

    private Employee() {}

    public Employee(String firstName, String lastName, String description) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return Objects.equals(id, employee.id) &&
                Objects.equals(firstName, employee.firstName) &&
                Objects.equals(lastName, employee.lastName) &&
                Objects.equals(description, employee.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, description);
    }

    public Long getId(){
        return id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName){
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", firstName='" + firstName + "\'" +
                ", lastName='" + lastName + "\'" +
                ", description='" + description + "\'" +
                "}";
    }

}