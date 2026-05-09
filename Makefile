EXELEARNING_EDITOR_REPO_URL ?= https://github.com/exelearning/exelearning.git
EXELEARNING_EDITOR_REF ?= v4.0.0
EXELEARNING_EDITOR_REF_TYPE ?= tag
EDITOR_SOURCE_DIR := exelearning
EDITOR_OUTPUT_DIR := $(CURDIR)/public/editor
EDITOR_ZIP_URL ?= https://github.com/exelearning/exelearning/releases/download/$(EXELEARNING_EDITOR_REF)/exelearning-static-$(EXELEARNING_EDITOR_REF).zip

TMP_DIR := .cache
EDITOR_ZIP := $(TMP_DIR)/exelearning-static.zip
EDITOR_EXTRACT_DIR := $(TMP_DIR)/exelearning-static

.PHONY: download-editor fetch-editor-source build-editor clean-editor build dev lint typecheck

download-editor:
	mkdir -p "$(TMP_DIR)"
	rm -rf "$(EDITOR_EXTRACT_DIR)" "$(EDITOR_ZIP)"
	curl -L "$(EDITOR_ZIP_URL)" -o "$(EDITOR_ZIP)"
	unzip -q "$(EDITOR_ZIP)" -d "$(EDITOR_EXTRACT_DIR)"
	rm -rf "$(EDITOR_OUTPUT_DIR)"
	mkdir -p "$(EDITOR_OUTPUT_DIR)"
	@if [ "$$(find "$(EDITOR_EXTRACT_DIR)" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')" = "1" ] && \
		[ "$$(find "$(EDITOR_EXTRACT_DIR)" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')" = "1" ]; then \
		cp -R "$$(find "$(EDITOR_EXTRACT_DIR)" -mindepth 1 -maxdepth 1 -type d)"/. "$(EDITOR_OUTPUT_DIR)/"; \
	else \
		cp -R "$(EDITOR_EXTRACT_DIR)"/. "$(EDITOR_OUTPUT_DIR)/"; \
	fi

fetch-editor-source:
	rm -rf "$(EDITOR_SOURCE_DIR)"
	@if [ "$(EXELEARNING_EDITOR_REF_TYPE)" = "branch" ] || [ "$(EXELEARNING_EDITOR_REF_TYPE)" = "tag" ]; then \
		git clone --depth 1 --branch "$(EXELEARNING_EDITOR_REF)" "$(EXELEARNING_EDITOR_REPO_URL)" "$(EDITOR_SOURCE_DIR)"; \
	elif [ "$(EXELEARNING_EDITOR_REF_TYPE)" = "commit" ]; then \
		git clone --depth 1 "$(EXELEARNING_EDITOR_REPO_URL)" "$(EDITOR_SOURCE_DIR)"; \
		cd "$(EDITOR_SOURCE_DIR)" && git checkout "$(EXELEARNING_EDITOR_REF)"; \
	else \
		echo "EXELEARNING_EDITOR_REF_TYPE must be branch, tag, or commit"; \
		exit 1; \
	fi

build-editor:
	rm -rf "$(EDITOR_OUTPUT_DIR)"
	$(MAKE) fetch-editor-source
	cd "$(EDITOR_SOURCE_DIR)" && bun install
	cd "$(EDITOR_SOURCE_DIR)" && OUTPUT_DIR="$(EDITOR_OUTPUT_DIR)" bun run build:static

clean-editor:
	rm -rf "$(EDITOR_SOURCE_DIR)" "$(EDITOR_OUTPUT_DIR)" "$(EDITOR_ZIP)" "$(EDITOR_EXTRACT_DIR)"

build:
	npm run build

dev:
	npm run dev

lint:
	npm run lint

typecheck:
	npm run typecheck
