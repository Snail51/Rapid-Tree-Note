<!--
Copyright 2023-2025, Brendan Andrew Rood
-->

<!--
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
-->

<!DOCTYPE html>
<html>
    <head>
        <?php 
            $metadata = file_get_contents("./../Resources/partials/metatags.html");
            $metadata = str_replace("{{pageTitle}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{description}}", "In-depth instructions on how the directory-style document navigation links work in the RTN", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./../Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>
    </head>
    <body>
        <script>
            window.location.replace("./../program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgIKehoCAgICAgIDiutrOq5LNtAw18HOWiMAW1rroU-DyU6OTOoWHEPG-qGBiF0AQurJBssKAtrelsj1rjqxX14u6oUB8FnC3uv_GWNOHszDfLh4a-Qe2R4h7EdFTJCYLGorvsjVgsM9K4vERHDqoRda7OK0q7jrxfTqLNT_VoxeOjP4e6D2tQHertb6N3CPFO_aWqSRdcYjQDxSWjUxE6f7UmBEMJ6OxtScvkHKoYZVGOsnv0SbzB1HXweVcBqRxgKpceyWIF7fy4gAvyC3OUNQWnQDh5YhJS-40UKa7lyk998N0FUqlhy1FwtOT61JyMzVggkWVM7AhgQbnMcCE-87kMjR5yFOUbODXHAOuvgmBufU-fF8j9-5ADPsIqaHTBrqQ1nLa1j7NUx9csfC8cafHig915884xXgOFLjBb_OVeuidnbv8E2wzRpOrANQICPQYr5WAQ9UmTiG0vRpZiCzxNX3CiSaMfECmpkbuG5p4IN6atIzan3DnnxaYuftCyHR4jI9xKA6lX0LJV8QbP5ZqGYG1RUxwFqhiarmQCP7VrlEBWTW8mpoPYBEwH0wG-iDiKYdkIZLI9zRG9P8rYwGpuNDFK_05BmWaSZRcBFZr3rWurGt59-erRwoCIZVsRvigmCwwCmaAyRtcapk0GiwrtsGEQP3IsvPCNYwZJCDvTMY04PdzYPepGORcwjtt4p7zY0_n6JaPBYXBHLX3qI8hOP2sTFdlByN5ZgVPvJRFk-Oo1hw0EcwT4UJk4xf6BIc6_flgF_JHLkaVi0qSknCDMm9NhHS3A4sl7XBqnPnq7inpE0U4NZ9Ho4XxTAo9w0HWjG0JOAifpyBl-hEsYiHF8KAKo0B5no7qTEgoDQDTcKsNgxTl3XR_YaN3uA");
        </script>    
    </body>
</html>