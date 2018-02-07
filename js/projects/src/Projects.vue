<template>
    <div id="projects">
        <h2>
            Projects
        </h2>
        <p>
            Showing {{ shownProjects.length }} projects.
            <a class="filter-toggler collapsed" data-toggle="collapse" href="#projects-filters">
               Filter projects
            </a>
        </p>
        <filters
            v-on:update="updateFilters"
        ></filters>
        <project
            v-for="(projectIndex, i) in shownProjects"
            :key="i"
            :project="projects[projectIndex]"
        ></project>
    </div>
</template>

<script>
const Filters = require('./Filters.vue');
const Project = require('./Project.vue');

module.exports = {
    name: 'Projects',
    components: {
        'filters': Filters,
        'project': Project,
    },
    data: function () {
        return {
            // Array of all projects
            projects: [],
            // Array of shown project indexes
            shownProjects: [],
        };
    },
    created: function () {
        $.get('/api/projects.json', (data) => {
            console.log(data);
            // Last project in array is {}
            this.projects = data.projects.slice(0, data.projects.length - 1);
            // All projects are shown by default
            this.shownProjects = this.projects.map((p, i) => i);
        }).fail(function (err) {
            console.error('Error loading project data', err);
        });
    },
    methods: {
        updateFilters: function (filters) {
            // Handle search filter type differently
            // - Searches multiple fields
            let search = null;
            if (filters.search != null && filters.search.length > 0) {
                search = filters.search.toLowerCase();
            }
            delete filters.search;

            // Ignore if no types or all types are filtered
            if (filters.type != null && (filters.type.length === 0 || filters.type.length === 3))
                delete filters.type;

            // Ignore tags if none or "All" selected
            if (filters.tags != null && (filters.tags.length === 0 || filters.tags.indexOf('*') >= 0))
                delete filters.tags;

            // Get array of filter property keys
            let filterKeys = Object.keys(filters);
            // Construct shown projects array
            this.shownProjects = this.projects.map((project, projectIndex) => {
                // Whether to show the project
                let showProject = true;

                // Handle `search` filter
                // - Include projects where `search` term is in title or description
                if (search != null) {
                    let title = project.title.toLowerCase();
                    let desc = project.description.toLowerCase();
                    showProject = title.indexOf(search) >= 0 || desc.indexOf(search) >= 0;
                }

                // Handle all other filter types
                let i = 0;
                while (showProject && i < filterKeys.length) {
                    let filterName = filterKeys[i];
                    let filterValue = filters[filterName];
                    console.log(filterName);
                    console.log(project);
                    if (filterValue.constructor === Array) {
                        if (project[filterName].constructor === Array) {
                            // Array filter value + array project value
                            // - Search both arrays as OR tests
                            let show = false,
                                j = 0,
                                k = 0;
                            while (!show && k < project[filterName].length) {
                                let j = 0;
                                while (!show && j < filterValue.length) {
                                    show = project[filterName][k] === filterValue[j];
                                    j++;
                                }
                                k++;
                            }
                            showProject = show;
                        } else {
                            // Array filter value, single project value
                            // - Treat array of filters as OR test
                            let show = false,
                                j = 0;
                            while (!show && j < filterValue.length) {
                                show = project[filterName] === filterValue[j];
                                j++;
                            }
                            showProject = show;
                        }
                    } else {
                        if (project[filterName].constructor === Array) {
                            // Single filter value, array project value
                            // - Filter value must be in array
                            let show = false,
                                j = 0;
                            while (!show && j < project[filterName].length) {
                                show = project[filterName][j] === filterValue;
                                j++;
                            }
                            showProject = show;
                        } else {
                            // Single filter value, single project value
                            // - Simple equality check
                            showProject = projectData[filterName] === filterValue;
                        }
                    }
                    i++;
                }

                // Return index if to be shown, else null
                return showProject ? projectIndex : null;
            })
            /* Remove any null values */
            .filter(index => index != null);
        }
    }
};
</script>