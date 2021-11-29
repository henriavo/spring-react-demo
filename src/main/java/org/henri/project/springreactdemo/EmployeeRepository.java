package org.henri.project.springreactdemo;

import org.springframework.data.repository.PagingAndSortingRepository;

// CrudRepository<domanObject, primaryKey>
public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {

}
