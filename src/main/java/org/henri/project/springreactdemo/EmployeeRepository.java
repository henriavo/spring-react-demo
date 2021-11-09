package org.henri.project.springreactdemo;

import org.springframework.data.repository.CrudRepository;

// CrudRepository<domanObject, primaryKey>
public interface EmployeeRepository extends CrudRepository<Employee, Long> {

}
