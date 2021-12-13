package org.henri.project.springreactdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component // means it will be automatically picked up by @SpringBootApplication
public class DatabaseLoader implements CommandLineRunner {
    // implementing clr so that it runs after all beans are created and registered

    private final EmployeeRepository employees;
    private final ManagerRepository managers;

    @Autowired
    public DatabaseLoader(EmployeeRepository repository,  ManagerRepository managerRepository) {
        this.employees = repository;
        this.managers = managerRepository;
    }

    @Override
    public void run(String... strings) throws Exception {  // invoked w/ command line args, loading up my data

        Manager greg = this.managers.save(new Manager("greg", "turnquist",
                "ROLE_MANAGER"));
        Manager oliver = this.managers.save(new Manager("oliver", "gierke",
                "ROLE_MANAGER"));

        // need to authenticate to save employee data
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("greg", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

        this.employees.save(new Employee("Frodo", "Baggins", "ring bearer", greg));
        this.employees.save(new Employee("Bilbo", "Baggins", "burglar", greg));
        this.employees.save(new Employee("Gandalf", "the Grey", "wizard", greg));

        // need to authenticate to save employee data
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("oliver", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

        this.employees.save(new Employee("Samwise", "Gamgee", "gardener", oliver));
        this.employees.save(new Employee("Merry", "Brandybuck", "pony rider", oliver));
        this.employees.save(new Employee("Peregrin", "Took", "pipe smoker", oliver));

        // authentication context cleared
        SecurityContextHolder.clearContext();


//        this.repository.save(new Employee("Diego", "Luna",
//                        "Mexican actor, singer, director, and producer."));
//
//        this.repository.save(new Employee("Bartholomew", "Simpson", "el barto"));
//        this.repository.save(new Employee("Lenford", "Leonard", "jerk"));
//        this.repository.save(new Employee("Otto", "Mann", "school bus driver"));
//        this.repository.save(new Employee("Martin", "Prince Jr.", "Martin Priss"));
//        this.repository.save(new Employee("Cecil", "Terwilliger", "criminal mastermind"));
//        this.repository.save(new Employee("Doris", "Freedman", "cafeteria chef and nurse"));
    }
}
