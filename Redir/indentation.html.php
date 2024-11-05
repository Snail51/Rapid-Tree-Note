<!--
Copyright 2023+2024, Brendan Andrew Rood
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
            $metadata = str_replace("{{description}}", "In-depth instructions on how indentation and document structure works in the RTN", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./../Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>
    </head>
    <body>
        <script>
            window.location.replace("./../program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgILphoCAgICAgIDkOxgOtOa1RMWtC1rAWgHD4MuS2q4s-N7_eczgABt9OWpoi5V3uc9KWgITdID0KJ7OLRRh3HlkPu04VZFxrO3tKXJ7f3IKWBHU0q03LrS5PuobDSkddQkpvWcCmWagcPrhDnGzx3OoPOt4EhEIQjOxtqU3GJo470FmiRu6-OUiz75FJ6sBBdbgfBEHPW5R3W-6Jispd3WiJ1u9eJIxJUxVp4JZNPgz8aMjmxFkZREwJlLaOGHWjZqIW0qWoJgG-_Y5_44xQxkPJ4yfzHXVWWiI_EDURZWieuUU3858-VwiZ7afzJ4RWc3uIDdhTIlUGumcoZXa27uTZDRFGEXvoknP8n3lVaVEj1ciNydGtsiuZWA9ILEuP38ACe2gz9hyyFGzFtfMr40yTH6HuAX3kAI2eGQpGoBr7Lq-1UqRF55PjQeHOhHWzR4URk7dZiz_4ukMLoacSIdh5T4_toR8bBnt-xPrkvGrH9tR-uZ_337l-wRuFNjKEimxyqOLm57p7_Aq7y64QM_pSXiHYy6mDDUItaaqFe4G5HGaLTOaKMN2eWklpSqc4D_E-V5qPswmVsnraXtPjWowwluyeVRumKgq3poBKHS5iub1WHDIuGzs8I1uyeu0AUXpR4NmT4jxNVftddfNSe4JwfvL-LggOyh7Jw5VqWUBrn2xp_kLr9EHf0mcsgA");
        </script>    
    </body>
</html>