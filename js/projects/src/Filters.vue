<template>
    <div id="projects-filters" class="collapse">
        <form class="row" v-on:submit="updateFilters($event)">
            <div class="col-12">
                <div class="form-group">
                    <label for="search">Search</label>
                    <input type="text" class="form-control" v-model="search" placeholder="Some text..." />
                </div>
                <div class="form-group">
                    <label for="tags">Tags</label>
                    <select class="form-control" multiple v-model="tags">
                        <option selected value="*">All</option>
                        <option value="PHP">PHP</option>
                        <option value="Java">Java</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Node.js">Node.js</option>
                        <option value="Vue.js">Vue.js</option>
                        <option value="Angular">Angular</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="type">Project Type</label><br />
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <input class="form-check-input" type="checkbox" value="edu" v-model="type" checked /> Education
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <label class="form-check-label">
                            <input class="form-check-input" type="checkbox" value="personal" name="type" v-model="type" checked /> Personal
                        </label>
                    </div>
                    <div class="form-check-inline">
                    <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" value="work" name="type" checked v-model="type" /> Paid work
                    </label>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-primary mx-2" role="submit">Update</button>
                <a class="btn btn-secondary mx-2" v-on:click="resetFilters()" href="#projects-filters">Reset</a>
            </div>
        </form>
    </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            search: null,
            tags: [],
            type: []
        };
    },
    methods: {
        /**
         * Emit updated filters to parent
         */
        updateFilters: function (event) {
            // Prevent form submission refreshing page
            if (event != null)
                event.preventDefault();
            // Emit filters object as `update` event
            this.$emit('update', {
                search: this.search,
                tags: this.tags,
                type: this.type,
            });
        },
        /**
         * Reset filters to default and emit
         */
        resetFilters: function () {
            this.search = null;
            this.tags = [];
            this.type = [];
            this.updateFilters();
        },
    },
};
</script>