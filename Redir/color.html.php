<!--
Copyright 2023-2025, Brendan Andrew Rood
-->

<!--
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
-->

<!DOCTYPE html>
<html>
    <head>
        <?php 
            $metadata = file_get_contents("./../Resources/partials/metatags.html");
            $metadata = str_replace("{{pageTitle}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{description}}", "In-depth instructions on how to format text to be specific colors in RTN documents", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./../Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>
    </head>
    <body>
        <script>
            window.location.replace("./../program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgIK2hYCAgICAgIDhO1kOZubIfbdOaZ6jTxWIq-i-xz9-HbveW2rGJk_L2-k52k7-ExQuFW_4hTZr1aIQzNO5FhLr-Sgdup_csPMZt5azFtX7yGg2bNT7gpFTfSjHpQnCKVPljEfFYQGtWQfQCzESnAg_tl8Kua0EXl4YkF02fNb_VBqA-_Z4v1Cbrlwpu8C2KXAjg-2qfcyV76zBZu8DQCE14jNsE0NOTgH1MFaR8mrdLXq1mDfwr06aDg-AsV6_YoYiuGi12oJVCk7t-TXV6EFkGlv165TIAW1NZhjDPHQXNOpabwTOhV_QLG6bkNT8-xJiouHjzdZh0N5Ze6H-YgvVFvCd0Seah2b_4_E_HkzhCiTqorg2g-YicZNS81mGxF1HZDLjonuFSqoz8ESG-Ep5A4LexltIKk5NT2TvWGqtcLNWDzG5I_TX-YKAI_C2QMyghMKj7_cld1OUep_VyblwvuHUKvV_rIlTBhxIBnd1ekfe0CKudRustcuk2Q5mnCLuR3DU9cvJdnhZ5F2tqoJHf3aZ22IjBgDKtMi-Es73fJnz_y9PgONMYDjrvDBvBo2bxE5XaN0UmV2jHfhtA2v7CyCL4COxCZ0WhzjCbI3Eqh7UhS8c7-Q6trlfwqyLulyqc142f0jkQA0");
        </script>    
    </body>
</html>