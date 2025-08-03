-- SELECT word, definition as def FROM entries WHERE word not like '% %' AND def not like '@@@%' ORDER BY word DESC;


-- SELECT *
--   FROM entries
--   WHERE definition LIKE '%>exclamation<%'
--   ORDER BY LENGTH(definition) DESC
--   LIMIT 10;



-- SELECT * FROM entries WHERE definition LIKE '%>PHRASAL<%' LIMIT 10;
-- SELECT * FROM entries WHERE word = 'good';
SELECT * FROM entries WHERE definition LIKE '%NOUN PHRASE%' LIMIT 10;
